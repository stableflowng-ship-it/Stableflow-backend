// 
// user schema serving this route

import { FastifyPluginAsync } from "fastify";
import { requestOtpRouteOpts, verifyAccoRouteOpts } from "../../schemas/auth/auth.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/request-otp', requestOtpRouteOpts);
  fastify.post('/verify-account', verifyAccoRouteOpts)
  //get urls
};

export default userRoutes;