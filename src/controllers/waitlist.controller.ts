// 

import { FastifyReply, FastifyRequest } from "fastify";
import { WaitlistService } from "../services/waitlist.service";
import { failureData, successData } from "../utils/response.helper";


export class WaitlistController {
  static joinWaitlist = async (req: FastifyRequest<{ Body: { email: string } }>, reply: FastifyReply) => {
    try {
      const response = await WaitlistService.joinWaitlist(req.body)
      const data = { ...successData, message: response }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }
}