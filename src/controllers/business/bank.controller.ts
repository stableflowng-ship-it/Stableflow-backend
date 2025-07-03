// 

import { FastifyReply, FastifyRequest } from "fastify";
import { BankService } from "../../services/business/bank.service";
import { BankType } from "../../utils/dataTypes/bank.datatype";
import { failureData, successData } from "../../utils/response.helper";


export class BankController {
  static addBankAccount = async (req: FastifyRequest<{ Body: BankType }>, reply: FastifyReply) => {
    try {
      const response = await BankService.addBankAccount(req.body, req.user)
      const data = { ...successData, message: response, code: 201 }
      reply.code(201).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(400).send(error)
    }
  }
}