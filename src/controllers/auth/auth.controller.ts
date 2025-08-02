// 

import { FastifyReply, FastifyRequest } from "fastify";
import { Auth } from "../../utils/dataTypes/user.datatypes";
import { UserServices } from "../../services/auth/auth.service";
import { failureData, successData } from "../../utils/response.helper";
import { envHelper } from "../../config/env.helper";

export class UserController {
  static createOrSignIn = async (req: FastifyRequest<{ Body: Auth }>, reply: FastifyReply) => {
    try {
      const response = await UserServices.createOrSignIn(req.body)
      const data = { ...successData, message: response.message, data: response.otp }
      return reply.code(201).send(data)
    } catch (e) {
      const error = { ...failureData, message: e.message as string }
      reply.code(400).send(error)
    }
  }
  static verifyAccount = async (req: FastifyRequest<{ Body: Auth }>, reply: FastifyReply) => {
    try {
      const response = await UserServices.verifyAccount(req.body)
      const data = { ...successData, message: response.message, data: response.token }
      reply.code(201).setCookie(
        "auth_token", response.token, {
        path: '/',
        httpOnly: true,
        secure: envHelper.environ !== "dev",
        sameSite: envHelper.environ === "dev" ? 'lax' : 'none',
        domain: envHelper.environ !== "dev" ? '' : undefined,
        maxAge: 60 * 60 * 24 * 14,
      }
      ).send(data)
    } catch (e) {
      const error = { ...failureData, message: e.message as string }
      reply.code(400).send(error)
    }
  }
}