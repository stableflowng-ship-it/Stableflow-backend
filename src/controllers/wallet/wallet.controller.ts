// 

import { FastifyReply, FastifyRequest } from "fastify";
import { CreateWallet, GetRate, WebhookPaycrest, WebhookPayload, WithdrawalType } from "../../utils/dataTypes/wallet.datatype";
import { WalletService } from "../../services/wallet/wallet.service";
import { failureData, successData } from "../../utils/response.helper";
import { createHmac } from "crypto";
import { envHelper } from "../../config/env.helper";
import HttpException from "../../config/error.config";


const apiKey = envHelper.block_radar.api_key
export class WalletControllers {

  static generateWalletAddress = async (req: FastifyRequest<{ Body: CreateWallet }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.generateWalletAddress(req.body)
      const data = { ...successData, data: response.data, message: response.message, code: 201 }
      reply.code(201).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static getBusinessWallets = async (req: FastifyRequest<{ Params: { businessId: string } }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.getBusinessWallets(req.params.businessId, req.user)
      const data = { ...successData, data: response.data, message: response.message }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static withdrawBlockradar = async (req: FastifyRequest<{ Body: WithdrawalType }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.withdrawBlockradar(req.body, req.user)
      const data = { ...successData, data: response.data, message: response.message }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      console.log('error', error)
      reply.code(400).send(error)
    }
  }

  static webhookBlockradar = async (req: FastifyRequest<{ Body: WebhookPayload }>, reply: FastifyReply) => {
    try {
      const hash = createHmac('sha512', apiKey).update(JSON.stringify(req.body)).digest('hex');
      if (hash !== req.headers['x-blockradar-signature']) {
        throw new HttpException(401, 'Invalid signature')
      }
      const response = await WalletService.webhookBlockradar(req.body)
      const data = { ...successData, data: response, message: 'Webhook for blockradar', code: 201 }
      reply.code(201).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static getRatePaycrest = async (req: FastifyRequest<{ Querystring: GetRate }>, reply: FastifyReply) => {
    try {
      const response = await WalletService.getRatePaycrest(req.query)
      const data = { ...successData, data: response, message: 'Rates from paycrest', code: 201 }
      reply.code(200).send(data)
    } catch (e) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static webhookPaycrest = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const signature = req.headers['x-paycrest-signature'] as string | undefined;
      if (!signature) throw new HttpException(401, 'Not authentication')
      if (!verifyPaycrestSignature(req.body, signature, envHelper.paycrest.secert_key!)) {
        return reply.status(401).send("Invalid signature");
      }
      const response = await WalletService.webhookPaycrest(req.body)
      const data = { ...successData, data: response, message: 'Paycrest webhook' }
      reply.code(200).send(data)
    } catch (e) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }
}


function verifyPaycrestSignature(requestBody, signatureHeader: string, secretKey: string) {
  const calculatedSignature = calculateHmacSignature(requestBody, secretKey);
  return signatureHeader === calculatedSignature;
}

function calculateHmacSignature(data, secretKey: string) {
  const crypto = require('crypto');
  const key = Buffer.from(secretKey);
  const hash = crypto.createHmac("sha256", key);
  hash.update(data);
  return hash.digest("hex");
}