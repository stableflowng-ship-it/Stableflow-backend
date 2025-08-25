// 

import { User } from "../../entities/user/user.entities";

export type Auth = {
  email: string,
  otp: string
}

export type SignInPayload = {
  email: string,
  password: string
}

declare module 'fastify' {
  interface FastifyRequest {
    user: User;
  }
}