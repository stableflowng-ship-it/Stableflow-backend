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
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static fecthBanks = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const response = await BankService.fecthBanks()
      const data = { ...successData, message: 'All nigeria banks', data: response, code: 200 }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static verifyBank = async (req: FastifyRequest<{ Querystring: { accountNumber: string, bankCode: string } }>, reply: FastifyReply) => {
    try {
      const response = await BankService.verifyBank(req.query)
      const data = { ...successData, message: 'Bank verified', data: response, code: 200 }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  // for paycrest
  static fetchSupportedBank = async (_: FastifyRequest, reply: FastifyReply) => {
    try {
      const response = await BankService.fetchSupportedBank()
      const data = { ...successData, data: response, message: 'All banks supported by paycrest' }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static verifyBankPaycrest = async (req: FastifyRequest<{ Querystring: { accountNumber: string, bankCode: string } }>, reply: FastifyReply) => {
    try {
      const response = await BankService.verifyBankPaycrest(req.query)
      const data = { ...successData, data: response, message: 'verify bank with paycrest' }
      reply.code(200).send(data)
    } catch (e) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }
}