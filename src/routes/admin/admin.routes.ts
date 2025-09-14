// 


// 

import { FastifyPluginAsync } from "fastify";
import { approveBusiOpts, getAllBusiOpts, getAllUser, getTrans } from "../../schemas/admin/admin.schema";


const adminRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.patch('/approve-business/:id', approveBusiOpts)
  //get urls
  fastify.get('/get-businesses', getAllBusiOpts);
  fastify.get('/get-users', getAllUser)
  fastify.get('/get-transactions', getTrans)
};

export default adminRoutes