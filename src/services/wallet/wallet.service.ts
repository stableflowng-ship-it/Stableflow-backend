// 

import { envHelper } from "../../config/env.helper"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { WalletAddressRequest } from "../../utils/dataTypes/wallet.datatype"
import { request } from 'undici'

const busiRepo = AppDataSource.getRepository(Business)
// const walleyRepo = AppDataSource.getRepository()

const apiKey = envHelper.block_radar.api_key
const walletId = envHelper.block_radar.wallet_id
const b_baseUrl = "https://api.blockradar.co/v1"

export class WalletServive {

  static generateWalletAddress = async (params: { busiId: string }) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :id', { id: params.busiId }).getOne()
    if (business.onboarding_step !== OnboardingStep.APPROVED) {
      throw new HttpException(400, `Business(${business.name}) is not yet Approved`)
    }

    if (business.address_id) {
      throw new HttpException(400, `Business(${business.name}) already has a wallet address`)
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
    const walletAddress = response.data?.address;
    const addressId = response.data?.id;
  }
}