// 

import { FastifyPluginAsync } from "fastify";
import { blockRadarWebhook, generateWallet, getBusinessWallets } from "../../schemas/wallet/wallet.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/generate', generateWallet);
  fastify.post('/webhook-blockradar', blockRadarWebhook)
  //get urls
  fastify.get('/get/:businessId', getBusinessWallets)
};

export default userRoutes;