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
  block_radar: {
    api_key: process.env.BLOCKRADAR_API_KEY,
    network: process.env.NETWORK,
    wallet_id: process.env.WALLET_ID,
  },
  nubapi: {
    token: process.env.NUBAPI_TOKEN
  },
  environ: process.env.ENVIRONMENT,
  token_pass: process.env.TOKEN_PASSWORD
}