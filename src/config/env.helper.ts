// 
require('dotenv').config()
export const envHelper = {
  db: {
    host: process.env.DATABASE_HOST,
    port: parseInt(process.env.DATABASE_PORT),
    username: process.env.DATABASE_NAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE,
  },
  email: {
    host: process.env.NOREPLY_HOST,
    username: process.env.NOREPLY_USERNAME,
    password: process.env.NOREPLY_PASSWORD,
    email: process.env.NOREPLY_EMAIL,
  },
  block_radar: {
    api_key: process.env.BLOCKRADAR_API_KEY,
    network: process.env.NETWORK,
    wallet_id: process.env.WALLET_ID,
  },
  paycrest: {
    api_key: process.env.PAYCREST_API,
  },
  redis: {
    host: process.env.REDIS_HOST,
    pass: process.env.REDIS_PASSWORD,
    user: process.env.REDIS_USERNAME,
    port: process.env.REDIS_PORT
  },
  nubapi: {
    token: process.env.NUBAPI_TOKEN
  },
  cors: process.env.CORS,
  environ: process.env.ENVIRONMENT,
  token_pass: process.env.TOKEN_PASSWORD
}