// 

import { FastifyReply, FastifyRequest } from "fastify";
import { BusinessType } from "../../utils/dataTypes/business.datatypes";
import { failureData, successData } from "../../utils/response.helper";
import { BusinessService } from "../../services/business/business.service";

export class BusinessController {
  static createBusiness = async (req: FastifyRequest<{ Body: BusinessType }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.createBusiness(req.user, req.body)
      const data = { ...successData, message: '' }
      reply.code(201).send(data)
    } catch (e: any) {
      const error = { ...failureData, error: e.message as string }
      reply.code(400).send(error)
    }
  }

  static getBusiness = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.getBusiness(req.params, req.user)
      const data = { ...successData, data: response, message: 'Business data fetch' }
      reply.code(200).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(e.status || 400).send(error)
    }
  }

  static updateBusiness = async (req: FastifyRequest<{ Body: BusinessType }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.updateBusiness(req.user, req.body)
      const data = { ...successData, data: response, message: 'Business update' }
      reply.code(200).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message as string }
      reply.code(e.status || 400).send(error)
    }
  }

}