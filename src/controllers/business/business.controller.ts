// 

import { FastifyReply, FastifyRequest } from "fastify";
import { BusinessType } from "../../utils/dataTypes/business.datatypes";
import { failureData, successData } from "../../utils/response.helper";
import { BusinessService } from "../../services/business/business.service";

export class BusinessController {
  static createBusiness = async (req: FastifyRequest<{ Body: BusinessType }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.createBusiness(req.user, req.body)
      const data = { ...successData, message: response.message, data: response.data, code: 201 }
      reply.code(201).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static getBusiness = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.getBusiness(req.params, req.user)
      const data = { ...successData, data: response, message: 'Business data fetch' }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static getUserBusiness = async (req: FastifyRequest, reply: FastifyReply) => {
    try {
      const response = await BusinessService.getUserBusiness(req.user)
      const data = { ...successData, data: response, message: 'User business data fetch' }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

  static updateBusiness = async (req: FastifyRequest<{ Body: BusinessType }>, reply: FastifyReply) => {
    try {
      const response = await BusinessService.updateBusiness(req.user, req.body)
      const data = { ...successData, data: response, message: 'Business update' }
      reply.code(200).send(data)
    } catch (e: unknown) {
      const errorMessage = (e instanceof Error) ? e.message : 'Something went wrong';
      const error = { ...failureData, error: errorMessage }
      reply.code(400).send(error)
    }
  }

}