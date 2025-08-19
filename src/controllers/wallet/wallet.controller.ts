// 

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateWallet, WebhookPayload } from "../../utils/dataTypes/wallet.datatype";
import { WalletService } from "../../services/wallet/wallet.service";
import { failureData, successData } from "../../utils/response.helper";



export class WalletControllers {

  static generateWalletAddress = async (req: FastifyRequest<{ Body: CreateWallet }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.generateWalletAddress(req.body)
      const data = { ...successData, data: [], message: response, code: 201 }
      reply.code(201).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(400).send(error)
    }
  }

  static getBusinessWallets = async (req: FastifyRequest<{ Params: { businessId: string } }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.getBusinessWallets(req.params.businessId, req.user)
      const data = { ...successData, data: response.data, message: response.message }
      reply.code(200).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(e.status || 400).send(error)
    }
  }

  static webhookBlockradar = async (req: FastifyRequest<{ Body: WebhookPayload }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.webhookBlockradar(req.body)
      const data = { ...successData, data: response, message: 'Webhook for blockradar', code: 201 }
      reply.code(201).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(e.status || 400).send(error)
    }
  }
}