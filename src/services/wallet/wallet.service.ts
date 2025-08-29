// 

import { createHmac } from "crypto"
import { envHelper } from "../../config/env.helper"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { Wallet } from "../../entities/business/wallet.entity"
import { Transaction } from "../../entities/transaction/transaction.entity"
import { User } from "../../entities/user/user.entities"
import { CreateWallet, GetRate, WalletAddressRequest, WebhookPayload } from "../../utils/dataTypes/wallet.datatype"

const busiRepo = AppDataSource.getRepository(Business)
const walletRepo = AppDataSource.getRepository(Wallet)
const transRepo = AppDataSource.getRepository(Transaction)

const apiKey = envHelper.block_radar.api_key
const walletId = envHelper.block_radar.wallet_id
const b_baseUrl = "https://api.blockradar.co/v1/wallets"
const p_baseUrl = "https://api.paycrest.io/v1"

export class WalletService {
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
    console.log(wallet)
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
    // const response = { data: { id: "addr_123456", address: "0x1234567890abcdef" } }
    const newWallet = walletRepo.create({
      address_id: response?.id,
      wallet_address: response?.address,
      logoUrl: response.blockchain.logoUrl,
      coin_type: params.coinType,
      network: params.coinNetwork,
      business: business,
      business_id: business.id,
    })
    await walletRepo.save(newWallet)
    return `${params.coinNetwork} ${params.coinType} wallet created for business`
  }

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

  static webhookBlockradar = async (payload: WebhookPayload) => {

    const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.address_id = :addressId', { addressId: payload.data.address.id }).getOne()
    const business = await busiRepo.createQueryBuilder('business').where('business.id =:id', { id: wallet.business_id }).getOne()

    if (payload.event === "deposit.success") {
      const newTrans = transRepo.create({
        transaction_id: payload.data.id,
        business_id: business.id,
        token_amount: parseFloat(payload.data.amount),
        fiat_amount: 0,
        fiat_currency: 'ngn',
        token: payload.data.asset.symbol,
        chain: payload.data.asset['standard'],
        // status: 
        txHash: payload.data['blockHash'],
        senderAddress: payload.data.senderAddress,
        businessAddress: wallet.wallet_address,
        address_id: wallet.address_id,
        wallet_id: wallet.id,
        exchange_rate: 0,
        business: business
      })

      await transRepo.save(newTrans)
    }
  }

  static getRatePaycrest = async (payload: GetRate) => {
    const response = await fetch(`${p_baseUrl}/rates/${payload.token}/${payload.amount}/${payload.currency}?network=${payload.network}`, {
      method: "GET",
      headers: { 'content-type': 'application/json' },
    })
    if (!response.ok) {
      throw new HttpException(400, `Rate fetch failed: ${response.statusText}`);
    }
    const rateData: any = await response.json();
    return rateData.data;
  }

  static createOrderPaycrest = async () => {
    const rate = this.getRatePaycrest({ token: "USDT", amount: 100, currency: "NGN", network: 'base' })
    const orderData = {
      amount: 100,
      token: 'USDT',
      network: 'base',
      rate: rate, // Use the fetched rate
      recipient: {
        institution: 'GTB',
        accountIdentifier: '1234567890',
        accountName: 'John Doe',
        currency: 'NGN',
        memo: 'Salary payment for January 2024' // Optional: Purpose/narration for the payment
      },
      reference: 'payment-123',
      returnAddress: '0x1234567890123456789012345678901234567890'
    };
    const response = await fetch(`${p_baseUrl}/sender/orders`, {
      method: "POST",
      headers: {
        "API-Key": envHelper.paycrest.api_key,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(orderData)
    });
    const order = await response.json();

    // const { id, receiveAddress, validUntil, senderFee, transactionFee} = order;

    return 'Order created'
  }

}


