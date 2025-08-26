// 

import fastify from "fastify"
import HttpException from "../../config/error.config"
import { sendOtp, verifyOtp } from "../../config/redis.config"
import { AppDataSource } from "../../data-source"
import { User } from "../../entities/user/user.entities"
import { Auth, SignInPayload } from "../../utils/dataTypes/user.datatypes"
import { envHelper } from "../../config/env.helper"
import { sendEmail } from "../../config/noreply.config"
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userRepo = AppDataSource.getRepository(User)

export class UserServices {

  static createOrSignIn = async (payload: SignInPayload) => {
    let user = await userRepo.createQueryBuilder('user').addSelect('user.password').where('user.email = :email', { email: payload.email }).getOne()
    if (!user) {
      user = userRepo.create({
        email: payload.email,
        is_active: true
      })
    }

    await userRepo.save(user) // alway update for login
    const otp = await sendOtp(user.email)
    sendEmail({ to: user.email, subject: 'Your Stableflow Verification Token', html: { TOKEN: otp, YEAR: new Date().getFullYear() }, htmlPath: '../email_templates/token.html' })
    return { message: "otp sent" }
  }

  static verifyAccount = async (payload: Auth) => {
    const user = await userRepo.createQueryBuilder('user').where('user.email = :email', { email: payload.email }).getOne()
    if (!user) {
      throw new HttpException(400, "User not found")
    }
    const verify = await verifyOtp(user.email, payload.otp)
    if (!verify) {
      throw new HttpException(400, "Otp invalid or expired")
    }

    if (!user.is_email_verified) {
      user.is_email_verified = true
      await userRepo.save(user)
    }
    const token: string = jwt.sign({ email: user.email }, envHelper.token_pass)

    return { message: "User verified successfully", token }
  }
}