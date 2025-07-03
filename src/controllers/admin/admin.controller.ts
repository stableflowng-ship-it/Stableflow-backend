// 

import { FastifyReply, FastifyRequest } from "fastify";
import { BusiFilterType } from "../../utils/dataTypes/general.dataype";
import { failureData, successData } from "../../utils/response.helper";
import { AdminService } from "../../services/admin/admin.service";


export class AdminController {

  static getAllBusiness = async (req: FastifyRequest<{ Querystring: BusiFilterType }>, reply: FastifyReply) => {
    try {
      const response = await AdminService.getAllBusiness(req.query)
      const data = { ...successData, data: response, message: "All business" }
      reply.code(200).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message }
      reply.code(400).send(error)
    }
  }

  static approveBusiness = async (req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) => {
    try {
      const response = await AdminService.approveBusiness(req.params)
      const data = { ...successData, data: response, message: "All business" }
      reply.code(200).send(data)
    } catch (e) {
      const error = { ...failureData, error: e.message }
      reply.code(400).send(error)
    }
  }


}