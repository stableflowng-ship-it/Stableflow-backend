// 

import { FastifyPluginAsync } from "fastify";
import { generateWallet, getBusinessWallets } from "../../schemas/wallet/wallet.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/generate', generateWallet);
  //get urls
  fastify.get('/get/:businessId', getBusinessWallets)
};

export default userRoutes;