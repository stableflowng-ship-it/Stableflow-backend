// 

import { WalletControllers } from "../../controllers/wallet/wallet.controller";
import { Static, Type as T } from "@sinclair/typebox";
import { isAuth } from "../../utils/middleware";
import { successDataSchema } from "../../utils/response.helper";
import { object } from "zod";

export const CoinType = T.Union([
  T.Literal('usdc'),
  T.Literal('usdt'),
])
export const CoinNetwork = T.Union([T.Literal('bep20'), T.Literal('tron')])

const RateSchema = T.Object({
  token: T.String(),
  amount: T.Number(),
  currency: T.String(),
  network: T.String()
})


export type CoinTypeType = Static<typeof CoinType>

const walletSchema = T.Object({
  businessId: T.String(),
  coinType: CoinType,
  coinNetwork: CoinNetwork,
})

export const generateWallet = {
  schema: {
    tags: ["Wallet"],
    summary: 'Businesses can generate wallet address for different network and coin',
    body: walletSchema,
    response: {
      201: {
        description: 'Generate wallet',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: WalletControllers.generateWalletAddress
}

export const getBusinessWallets = {
  schema: {
    tags: ["Wallet"],
    summary: 'Get all wallets for businesses',
    params: T.Object({ businessId: T.String() }),
    response: {
      200: {
        description: 'Get business wallets',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: WalletControllers.getBusinessWallets
}

export const blockRadarWebhook = {
  schema: {
    tags: ["Wallet"],
    summary: 'Blockradar webhook',
    body: T.Object({}),
    response: {
      200: {
        description: 'Blockradar webhook',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  // preHandler: isAuth,
  handler: WalletControllers.webhookBlockradar
}

export const getRatePaycrest = {
  schema: {
    tags: ['Wallet'],
    summary: "Blockradar webhook",
    query: RateSchema,
    response: {
      200: {
        description: "Fecth rate from blockradar",
        type: "object",
        ...successDataSchema
      }
    }
  },
  handler: WalletControllers.getRatePaycrest
}

export const paycrestHookOpts = {
  schema: {
    tags: ['Wallet'],
    summary: "Paycrest webhook",
    body: T.Object(T.Any()),
    response: {
      200: {
        description: "Fecth rate from blockradar",
        type: "object",
        ...successDataSchema
      }
    }
  },
  handler: WalletControllers.webhookPaycrest
}