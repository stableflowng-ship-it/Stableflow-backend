// 

import { envHelper } from "../../config/env.helper"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { Wallet } from "../../entities/business/wallet.entity"
import { CreateWallet, WalletAddressRequest } from "../../utils/dataTypes/wallet.datatype"
import { request } from 'undici'

const busiRepo = AppDataSource.getRepository(Business)
const walletRepo = AppDataSource.getRepository(Wallet)

const apiKey = envHelper.block_radar.api_key
const walletId = envHelper.block_radar.wallet_id
const b_baseUrl = "https://api.blockradar.co/v1/wallets/"

export class WalletService {
  static generateWalletAddress = async (params: CreateWallet) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :id', { id: params.businessId }).getOne()

    if (!business) {
      throw new HttpException(400, 'Business doesn\'t exist')
    }
    const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.business_id = :busiId', { busiId: business.id }).getMany()

    if (business.onboarding_step !== OnboardingStep.APPROVED) {
      throw new HttpException(400, `Business(${business.name}) is not yet Approved`)
    }

    const checkWallet = wallet.find((obj) => obj.coin_type === params.coinType && obj.network === params.coinNetwork)

    if (checkWallet) {
      throw new HttpException(400, `Business(${business.name}) already has this type of wallet address`)
    }
    const formatBusiName = business.name.replace(/\s+/g, "_");

    const data: WalletAddressRequest = {
      disableAutoSweep: false,
      enableGaslessWithdraw: false,
      metadata: {
        business_id: business.id,
        user_id: business.owner_id,
        wallet_type: "bep20usdt",
      },
      name: `${formatBusiName}_${business.id}`,
      showPrivateKey: false,
    };

    const { body } = await request(`${b_baseUrl}/${walletId}/addresses`, {
      method: "POST",
      headers: { 'content-type': 'application/json', "x-api-key": apiKey },
      body: JSON.stringify(data)
    })
    const text = await body.text();
    const response = JSON.parse(text);
    console.log(response)
    const newWallet = walletRepo.create({
      address_id: response.data?.id,
      wallet_address: response.data?.address,
      coin_type: params.coinType,
      network: params.coinNetwork,
      business: business,
      business_id: business.id,
    })
    await walletRepo.save(newWallet)
    return `${params.coinNetwork} ${params.coinType} wallet created for business`
  }

  static getBusinessWallets = async (businessId: string) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :businessId', { businessId }).getOne()

    if (!business) {
      throw new HttpException(400, "Business doesn't exist")
    }

    const wallets = await walletRepo.createQueryBuilder('wallets').where('wallets.business_id = :businessId', { businessId }).getMany()

    return { data: wallets, message: '' }
  }
}