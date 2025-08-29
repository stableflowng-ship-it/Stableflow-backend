// 

import { FastifyReply, FastifyRequest } from "fastify";
import { Auth, SignInPayload } from "../../utils/dataTypes/user.datatypes";
import { UserServices } from "../../services/auth/auth.service";
import { failureData, successData } from "../../utils/response.helper";
import { envHelper } from "../../config/env.helper";

export class UserController {
  static createOrSignIn = async (req: FastifyRequest<{ Body: SignInPayload }>, reply: FastifyReply) => {
    try {
      const response = await UserServices.createOrSignIn(req.body)
      const data = { ...successData, message: response.message }
      return reply.code(201).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
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
        secure: envHelper.environ !== "localhost",
        sameSite: envHelper.environ === "localhost" ? 'none' : 'none',
        domain: envHelper.environ !== "localhost" ? '' : undefined,
        maxAge: 60 * 60 * 24 * 14,
      }
      ).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }
}