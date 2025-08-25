// 

import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import cors from '@fastify/cors'
import cookie from '@fastify/cookie';
import fastifySwagger from '@fastify/swagger';
import { envHelper } from "./config/env.helper";
const app = require('fastify')({
  logger: true
})

app.register(require('@fastify/basic-auth'), {
  validate: async (username: string, password: string, _: FastifyRequest, reply: FastifyReply) => {
    if (username !== 'admin' || password !== 'secret') { // this will go to env later
      return reply.code(401).send({ message: 'Unauthorized' });
    }
  },
  authenticate: true,
});

// cors configuration

const check: any = envHelper.cors
const corsEnv: any = JSON.parse(check.replace(/'/g, "\""));

app.register(cors, () => {
  return (_: FastifyRequest, callback: Function) => {
    const corsOptions = {
      origin: envHelper.environ === 'localhost'
      // origin: true
        ? true
        : corsEnv,
      methods: ['GET', 'HEAD', 'OPTIONS', 'PUT', 'PATCH', 'POST', 'DELETE'],
      allowedHeaders: [
        'Origin',
        'X-Requested-With',
        'Content-Type',
        'Accept',
        'X-Access-Token',
        'Authorization'
      ],
      credentials: true
    }
    callback(null, corsOptions)
  }
})

// swagger config
app.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'StableFlow API',
      description: 'API documentation for stable flow, number one bussiness crypto paymnet in Nigeria',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        cookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'auth_token',
        },
        //   bearerAuth: {
        //     type: 'http',
        //     scheme: 'bearer',
        //     bearerFormat: 'JWT',
        //   },
      },
    },
    security: [
      {
        // bearerAuth: [],
        cookieAuth: []
      },
    ],
  },
})

app.register(async function (instance: FastifyInstance) {
  instance.addHook('onRequest', app.basicAuth);
  instance.register(import('@fastify/swagger-ui'), {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
      filter: false,
    },
    uiHooks: {
      onRequest: function (_request, _reply, next) { next() },
      preHandler: function (_request, _reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, _request, _reply) => { return swaggerObject },
    transformSpecificationClone: true
  })
})
app.register(cookie);
app.register(require('@fastify/jwt'), { secret: "ffffff" });

// routes 
const prefix: string = "/api/v1"
app.get('/api', async (_: FastifyRequest, reply: FastifyReply) => {
  reply.send({ 'message': 'Stablecoin api' })
})

// register all routes
app.register(require('./routes/auth/auth.routes'), { prefix: `${prefix}/auth` })
app.register(require('./routes/business/business.routes'), { prefix: `${prefix}/business` })
app.register(require('./routes/admin/admin.routes'), { prefix: `${prefix}/admin` })
app.register(require('./routes/wallet/wallet.routes'), { prefix: `${prefix}/wallet` })

export default app