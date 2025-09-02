// 

import { FastifyPluginAsync } from "fastify";
import { blockRadarWebhook, generateWallet, getBusinessWallets, getRatePaycrest, paycrestHookOpts, withdrawal } from "../../schemas/wallet/wallet.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/generate', generateWallet);
  fastify.post('/webhook-blockradar', blockRadarWebhook)
  fastify.post('/webhook-paycrest', paycrestHookOpts)
  fastify.post('/withdrawal', withdrawal)
  //get urls
  fastify.get('/get/:businessId', getBusinessWallets)
  fastify.get('/rates', getRatePaycrest)
};

export default userRoutes;