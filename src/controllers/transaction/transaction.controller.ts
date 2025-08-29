// 

import { FastifyReply, FastifyRequest } from "fastify";
import { failureData, successData } from "../../utils/response.helper";
import { TransactionService } from "../../services/transaction/transaction.service";


export class TransactionController {

  static getBusinessTransactions = async (req: FastifyRequest<{ Params: { businessId: string } }>, reply: FastifyReply) => {
    try {
      const response = await TransactionService.getBusinessTransactions(req.params.businessId, req.user)
      const data = { ...successData, message: 'Business transaction', data: response, code: 200 }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }
}