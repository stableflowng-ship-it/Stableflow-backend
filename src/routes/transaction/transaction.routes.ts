// 

import { FastifyPluginAsync } from "fastify";
import { getBusiTrans } from "../../schemas/transaction/transaction.schemas";



const businessRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.get('/:businessId/get-all', getBusiTrans);
};

export default businessRoutes