// 

import { WalletControllers } from "../../controllers/wallet/wallet.controller";
import { Static, Type as T } from "@sinclair/typebox";
import { isAuth } from "../../utils/middleware";
import { successDataSchema } from "../../utils/response.helper";

export const CoinType = T.Union([
  T.Literal('usdc'),
  T.Literal('usdt'),
])
export const CoinNetwork = T.Literal('bep20')

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