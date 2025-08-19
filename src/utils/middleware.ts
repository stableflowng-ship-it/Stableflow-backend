// 

import { FastifyReply, FastifyRequest } from "fastify";
import { failureData } from "./response.helper";
import { AppDataSource } from "../data-source";
import { User } from "../entities/user/user.entities";
import { envHelper } from "../config/env.helper";
import HttpException from "../config/error.config";
var jwt = require('jsonwebtoken');

type Decode = {
  email: string, iat: number
}

const userRepo = AppDataSource.getRepository(User)
export const isAuth = async (req: FastifyRequest, reply: FastifyReply) => {
  try {
    const token = req.cookies.auth_token;
    const decodedToken: Decode = jwt.verify(token, envHelper.token_pass)
    console.log(decodedToken, '_____________')
    const user = await userRepo.createQueryBuilder('user').where('user.email = :email', { email: decodedToken.email }).getOne()

    if (!user) {
      throw new HttpException(401, 'You are not authenticated')
    }
    req.user = user
    return req.user
  } catch (e) {
    const error = { ...failureData, error: 'You are not authenticated' }
    reply.code(401).send(error)
  }
}

export const isAdmin = async (req: FastifyRequest, reply: FastifyReply) => {
  const user = req.user
  // if(user.)
}