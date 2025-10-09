// 

import { FastifyPluginAsync } from "fastify";
import { waitlistOpts } from "../schemas/waitlist.schema";

const waitlistRoutes: FastifyPluginAsync = async (fastify) => {
  fastify.post("/join", waitlistOpts)
}

export default waitlistRoutes