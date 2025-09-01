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

const withdrawalSch = T.Object({
  amount: T.Number(),
  address: T.String()
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

export const withdrawal = {
  schema: {
    tags: ['Wallet'],
    summary: "Withdrawal from wallet",
    body: withdrawalSch,
    response: {
      200: {
        description: "Withdrawal from wallet",
        type: "object",
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: WalletControllers.withdrawBlockradar
}

const ll = { "message": "Assets fetched successfully", "statusCode": 200, "data": [{ "id": "f271aacd-0b32-448a-af2b-34bf47c729a2", "isActive": true, "createdAt": "2025-08-31T23:34:07.577Z", "updatedAt": "2025-08-31T23:34:07.577Z", "asset": { "id": "be793fad-bc65-4866-8937-41d2605114a6", "name": "USD Coin", "symbol": "USDC", "decimals": 6, "address": "0x036CbD53842c5426634e7929541eC2318f3dCF7e", "standard": null, "currency": "USD", "isActive": true, "logoUrl": "https://res.cloudinary.com/blockradar/image/upload/v1716800083/crypto-assets/usd-coin-usdc-logo_fs9mhv.png", "network": "testnet", "isNative": false, "createdAt": "2024-06-08T12:59:13.061Z", "updatedAt": "2025-06-03T11:34:36.304Z", "blockchain": { "id": "28a730d3-211b-40f7-bb8f-dd589dcc738e", "name": "base", "symbol": "eth", "slug": "base", "derivationPath": "m/44'/60'/0'/0", "isEvmCompatible": true, "isL2": true, "logoUrl": "https://res.cloudinary.com/blockradar/image/upload/v1716800080/crypto-assets/Base_Network_Logo_vqyh7r.png", "isActive": true, "tokenStandard": null, "createdAt": "2024-06-07T11:09:56.586Z", "updatedAt": "2024-11-26T15:26:21.825Z" } } }, { "id": "e59bfb41-085d-48f2-b105-16009bc4030e", "isActive": true, "createdAt": "2025-08-31T23:34:07.577Z", "updatedAt": "2025-08-31T23:34:07.577Z", "asset": { "id": "d3e5b1df-3f23-4c02-a3df-9baa70311ee4", "name": "Ethereum", "symbol": "ETH", "decimals": 18, "address": "0x0000000000000000000000000000000000000000", "standard": null, "currency": "ETH", "isActive": true, "logoUrl": "https://res.cloudinary.com/blockradar/image/upload/v1716800081/crypto-assets/ethereum-eth-logo_idraq2.png", "network": "testnet", "isNative": true, "createdAt": "2024-06-08T12:59:12.549Z", "updatedAt": "2025-06-03T11:34:36.301Z", "blockchain": { "id": "28a730d3-211b-40f7-bb8f-dd589dcc738e", "name": "base", "symbol": "eth", "slug": "base", "derivationPath": "m/44'/60'/0'/0", "isEvmCompatible": true, "isL2": true, "logoUrl": "https://res.cloudinary.com/blockradar/image/upload/v1716800080/crypto-assets/Base_Network_Logo_vqyh7r.png", "isActive": true, "tokenStandard": null, "createdAt": "2024-06-07T11:09:56.586Z", "updatedAt": "2024-11-26T15:26:21.825Z" } } }] }