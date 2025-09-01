// 

import { createHmac } from "crypto"
import { envHelper } from "../../config/env.helper"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { Wallet } from "../../entities/business/wallet.entity"
import { Transaction } from "../../entities/transaction/transaction.entity"
import { User } from "../../entities/user/user.entities"
import { CreateOrder, CreateWallet, GetRate, WalletAddressRequest, WebhookPaycrest, WebhookPayload, WithdrawalResponse } from "../../utils/dataTypes/wallet.datatype"

const busiRepo = AppDataSource.getRepository(Business)
const walletRepo = AppDataSource.getRepository(Wallet)
const transRepo = AppDataSource.getRepository(Transaction)
const userRepo = AppDataSource.getRepository(User)

const apiKey = envHelper.block_radar.api_key
const walletId = envHelper.block_radar.wallet_id
const b_baseUrl = "https://api.blockradar.co/v1/wallets"
const p_baseUrl = "https://api.paycrest.io/v1"

export class WalletService {

  //generate wallet from blockradar
  static generateWalletAddress = async (params: CreateWallet) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :id', { id: params.businessId }).getOne()
    if (!business) {
      throw new HttpException(400, 'Business doesn\'t exist')
    }
    const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.business_id = :busiId AND wallet.coin_type =:coinType AND wallet.network =:network', { busiId: business.id, coinType: params.coinType, network: params.coinNetwork }).getOne()

    if (business.onboarding_step !== OnboardingStep.APPROVED) {
      throw new HttpException(400, `Business(${business.name}) is not yet Approved`)
    }
    // const checkWallet = wallet.find((obj) => obj.coin_type === params.coinType && obj.network === params.coinNetwork)
    if (wallet) {
      throw new HttpException(400, `Business(${business.name}) already has this type of wallet address`)
    }
    const formatBusiName = business.name.replace(/\s+/g, "_");

    const data: WalletAddressRequest = {
      disableAutoSweep: false,
      enableGaslessWithdraw: false,
      metadata: {
        business_id: business.id,
        user_id: business.owner_id,
        wallet_type: "bep20usdc",
      },
      name: `${formatBusiName}_${business.id}`,
      showPrivateKey: false,
    };
    const body = await fetch(`${b_baseUrl}/${walletId}/addresses`, {
      method: "POST",
      headers: { 'content-type': 'application/json', "x-api-key": apiKey },
      body: JSON.stringify(data)
    })
    const text: any = await body.json();
    const response = text.data;
    const newWallet = walletRepo.create({
      address_id: response?.id,
      wallet_address: response?.address,
      logoUrl: response.blockchain.logoUrl,
      coin_type: params.coinType,
      network: params.coinNetwork,
      business: business,
      business_id: business.id,
      blockchain: response.blockchain
    })
    await walletRepo.save(newWallet)
    return { message: `${params.coinNetwork} ${params.coinType} wallet created for business`, data: response }
  }

  //get business wallet
  static getBusinessWallets = async (businessId: string, user: User) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :businessId', { businessId }).getOne()
    if (!business) {
      throw new HttpException(400, "Business doesn't exist")
    }
    if (business.owner_id !== user.id) {
      throw new HttpException(403, 'Forbidden')
    }
    const wallets = await walletRepo.createQueryBuilder('wallets').where('wallets.business_id = :businessId', { businessId }).getOne()
    return { data: wallets, message: '' }
  }

  //webhook for blockradar
  static webhookBlockradar = async (payload: WebhookPayload) => {
    const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.address_id =:addressId AND wallet.wallet_address =:address', { addressId: payload.data.address.id, address: payload.data.address.address }).getOne()
    const business = await busiRepo.createQueryBuilder('business').leftJoinAndSelect('busi.bankDetails', 'bank').where('business.id =:id', { id: wallet.business_id }).getOne()
    const user = await userRepo.findOneBy({ id: business.owner_id })

    if (payload.event === "deposit.success" && wallet && business) {
      const newTrans = transRepo.create({
        transaction_id: payload.data.id,
        business_id: business.id,
        token_amount: parseFloat(payload.data.amount),
        fiat_amount: 0,
        fiat_currency: 'ngn',
        token: payload.data.asset.symbol,
        chain: payload.data.asset.standard || "base",
        token_logo: payload.data.asset.logoUrl,
        gatewayTxId: payload.data.hash,
        metadata: payload.data.metadata,
        type: "DEPOSIT",
        txHash: payload.data.blockHash,
        senderAddress: payload.data.senderAddress,
        businessAddress: wallet.wallet_address,
        address_id: wallet.address_id,
        wallet_id: wallet.id,
        exchange_rate: 0,
        business: business,
        reference: payload.data.reference
      })
      const transaction = await transRepo.save(newTrans)
      wallet.amount = wallet.amount + parseFloat(payload.data.amount)
      await walletRepo.save(wallet)

      if (business.auto_offramp) {
        const order = await this.createOrderPaycrest({ accountName: business.bankDetails.accountName, accountNumber: business.bankDetails.accountNumber, amount: parseFloat(payload.data.amount), bankName: business.bankDetails.bankName, network: 'base', returnAddress: wallet.wallet_address, token: 'USDC', reference: transaction.reference })
        await this.withdrawBlockradar({ address: order['receiveAddress'], amount: parseFloat(payload.data.amount) }, user)
        transaction.status = "PROCESSING"
        await transRepo.save(transaction)
      }


    } else if (payload.event === "withdraw.success") {

    }

    else {
      throw new HttpException(400, 'Wallet or Business not found')
    }
    return 'Webhook received'
  }

  // get rate from paycrest
  static getRatePaycrest = async (payload: GetRate) => {
    const response = await fetch(`${p_baseUrl}/rates/${payload.token}/${payload.amount}/${payload.currency}?network=${payload.network}`, {
      method: "GET",
      headers: { 'content-type': 'application/json' },
    })
    if (!response.ok) {
      throw new HttpException(400, `Rate fetch failed: ${response.statusText}`);
    }
    const rateData: any = await response.json();

    // const order = await this.createOrderPaycrest({ accountName: 'Pelumi Olufemi', accountNumber: '9053489201', amount: 10, bankName: 'OPAYNGPC', network: 'base', returnAddress: '0x2DC6836e58697Bf4Afd9BbA4C2330E1032cc9618', token: 'USDC', rate: rateData.data, reference: '' })
    return { rate: rateData.data };
  }

  // create order on paycrest
  static createOrderPaycrest = async (payload: CreateOrder) => {
    const rate = this.getRatePaycrest({ token: payload.token, amount: payload.amount, currency: "NGN", network: payload.network })
    const orderData = {
      amount: payload.amount,
      token: payload.token,
      network: payload.network,
      rate: parseFloat(payload.rate),
      recipient: {
        institution: payload.bankName,
        accountIdentifier: payload.accountNumber,
        accountName: payload.accountName,
        currency: 'NGN',
        memo: 'Salary payment for January 2024'
      },
      reference: payload.reference,
      returnAddress: payload.returnAddress
    };
    const response = await fetch(`${p_baseUrl}/sender/orders`, {
      method: "POST",
      headers: {
        "API-Key": envHelper.paycrest.api_key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
      // body: JSON.stringify(orderData)
    });
    const order = await response.json()
    console.log(order)
    return order
  }

  //withdrawal on blockradar
  static withdrawBlockradar = async (payload: WithdrawalType, user: User) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.owner_id =:ownerId', { ownerId: user.id }).getOne()
    const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.business_id =:businessId', { businessId: business.id }).getOne()
    const body = {
      assetId: envHelper.block_radar.wallet_id,
      address: payload.amount,
      amount: payload.amount.toString(),
    }
    const response = await fetch(`${b_baseUrl}/${envHelper.block_radar.wallet_id}/withdraw`, {
      method: "POST",
      headers: {
        "API-Key": envHelper.block_radar.api_key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })

    if (!response.ok) {
      throw new HttpException(400, 'Something went wrong')
    }
    const data: any = await response.json()
    if (!business.auto_offramp) {
      const newTrans = transRepo.create({
        transaction_id: data.data.id,
        business_id: business.id,
        token_amount: parseFloat(data.data.amount),
        fiat_amount: 0,
        fiat_currency: 'ngn',
        token: data.data.asset.symbol,
        chain: data.data.asset.standard || "base",
        token_logo: data.data.asset.logoUrl,
        gatewayTxId: data.data.hash,
        metadata: data.data.metadata,
        type: "WITHDRAWAL",
        txHash: data.data.blockHash,
        senderAddress: data.data.senderAddress,
        businessAddress: wallet.wallet_address,
        address_id: wallet.address_id,
        wallet_id: wallet.id,
        exchange_rate: 0,
        business: business
      })
      await transRepo.save(newTrans)
    }

    return 'Withdrawal initiated'
  }

  //webhook for paycrest
  // Server setup and webhook endpoint
  static webhookPaycrest = (payload: WebhookPaycrest) => {
    console.log(payload)
    return payload
  }
}





type WithdrawalType = {
  amount: number,
  address: string
}

const data = {
  "address": "0x2DC6836e58697Bf4Afd9BbA4C2330E1032cc9618",
  "name": "Mike_enterprises_ec3d1755-d942-446e-82dd-76992e581a8a",
  "type": "INTERNAL",
  "derivationPath": "m/44'/60'/0'/0/1",
  "metadata": {
    "business_id": "ec3d1755-d942-446e-82dd-76992e581a8a",
    "user_id": "57e382ab-96d1-46be-b8cc-bae7bbe5cf9c",
    "wallet_type": "bep20usdc"
  },
  "configurations": {
    "aml": {
      "provider": "ofac, fbi, tether, circle",
      "status": "success",
      "message": "Address is not sanctioned"
    },
    "showPrivateKey": false,
    "disableAutoSweep": false,
    "enableGaslessWithdraw": false
  },
  "network": "testnet",
  "blockchain": {
    "id": "28a730d3-211b-40f7-bb8f-dd589dcc738e",
    "name": "base",
    "symbol": "eth",
    "slug": "base",
    "derivationPath": "m/44'/60'/0'/0",
    "isEvmCompatible": true,
    "isL2": true,
    "isActive": true,
    "tokenStandard": null,
    "createdAt": "2024-06-07T11:09:56.586Z",
    "updatedAt": "2024-11-26T15:26:21.825Z",
    "logoUrl": "https://res.cloudinary.com/blockradar/image/upload/v1716800080/crypto-assets/Base_Network_Logo_vqyh7r.png"
  },
  "key": null,
  "id": "f05df715-8127-46b8-99ef-1c0928e4a6da",
  "isActive": true,
  "createdAt": "2025-09-01T00:22:19.706Z",
  "updatedAt": "2025-09-01T00:22:19.706Z"
}