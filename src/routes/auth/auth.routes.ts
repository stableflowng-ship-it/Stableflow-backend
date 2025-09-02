// 
// user schema serving this route

import { FastifyPluginAsync } from "fastify";
import { logOutOpts, requestOtpRouteOpts, verifyAccoRouteOpts } from "../../schemas/auth/auth.schema";

const userRoutes: FastifyPluginAsync = async (fastify) => {
  //post urls
  fastify.post('/request-otp', requestOtpRouteOpts);
  fastify.post('/verify-account', verifyAccoRouteOpts)
  fastify.post('/logout', logOutOpts)
  //get urls
};

export default userRoutes;