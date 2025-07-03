// 

import { FastifyPluginAsync } from "fastify";
import { createBusiOpts, getBusiOpts, updateBusiOpts } from "../../schemas/business/business.schema";
import { createBankOpts } from "../../schemas/business/bank.schema";


const businessRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/create', createBusiOpts);
  fastify.put('/update', updateBusiOpts)
  fastify.post('/add-bank', createBankOpts)
  //get urls
  fastify.get('/get-business/:id', getBusiOpts)
};

export default businessRoutes