// 


// 

import { FastifyPluginAsync } from "fastify";
import { approveBusiOpts, getAllBusiOpts } from "../../schemas/admin/admin.schema";


const adminRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.patch('/approve-business/:id', approveBusiOpts)
  //get urls
  fastify.get('/get-businesses', getAllBusiOpts);
};

export default adminRoutes