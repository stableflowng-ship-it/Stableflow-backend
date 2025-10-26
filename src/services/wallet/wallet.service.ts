// 

import { envHelper } from "../../config/env.helper"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { Wallet } from "../../entities/business/wallet.entity"
import { Transaction, TransactionStatus } from "../../entities/transaction/transaction.entity"
import { User } from "../../entities/user/user.entities"
import { CreateOrder, CreateWallet, GetRate, WalletAddressRequest, WebhookPayload, WithdrawalType } from "../../utils/dataTypes/wallet.datatype"
import { sendEmailResend } from "../../config/resend.config"

const busiRepo = AppDataSource.getRepository(Business)
const walletRepo = AppDataSource.getRepository(Wallet)
const transRepo = AppDataSource.getRepository(Transaction)
const userRepo = AppDataSource.getRepository(User)

const apiKey = envHelper.block_radar.api_key
const walletId = envHelper.block_radar.wallet_id
const b_baseUrl = "https://api.blockradar.co/v1/wallets"
const p_baseUrl = "https://api.paycrest.io/v1"

export class WalletService {
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

  //webhook for blockradar
  static webhookBlockradar = async (payload: WebhookPayload) => {

    if (payload.event === "deposit.success") {
      const transaction = await transRepo.findOneBy({ transaction_id: payload.data.id })
      if (transaction) return 'Transation already created'

      const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.address_id =:addressId AND wallet.wallet_address =:address', { addressId: payload.data.address.id, address: payload.data.address.address }).getOne()
      const business = await busiRepo.createQueryBuilder('business').leftJoinAndSelect('business.bankDetails', 'bank').where('business.id =:id', { id: wallet.business_id }).getOne()
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
          const { order, rate } = await this.createOrderPaycrest({ accountName: business.bankDetails.accountName, accountNumber: business.bankDetails.accountNumber, amount: parseFloat(payload.data.amount), bankName: business.bankDetails.bankCode, network: 'base', returnAddress: wallet.wallet_address, token: 'USDC', reference: transaction.reference })
          const { receiveAddress, id } = order.data
          await this.withdrawBlockradar({ address: receiveAddress, amount: parseFloat(payload.data.amount) }, user)
          transaction.status = TransactionStatus.PROCESSING
          transaction.offrampOrderId = id
          transaction.exchange_rate = parseFloat(rate)
          transaction.fiat_amount = parseFloat((parseFloat(payload.data.amount) * parseFloat(rate)).toFixed(2))
          transaction.recipientAcct = business.bankDetails.accountNumber
          transaction.recipientBank = business.bankDetails.bankName
          wallet.amount = wallet.amount - parseFloat(payload.data.amount)
          await walletRepo.save(wallet)
          await transRepo.save(transaction)
        }
        sendEmailResend({ htmlPath: "../email_templates/notication.html", subject: "Deposit recieved", to: user.email, html: { name: user.full_name, amount: payload.data.amount, date: payload.data.createdAt } })
      }
      else {
        throw new HttpException(400, 'Wallet or Business not found')
      }
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

    // const order = await this.createOrderPaycrest({ accountName: 'Pelumi Olufemi', accountNumber: '9053489201', amount: 5, bankName: 'OPAYNGPC', network: 'base', returnAddress: '0x2DC6836e58697Bf4Afd9BbA4C2330E1032cc9618', token: 'USDC', rate: rateData.data, reference: 'dfhhahs' })
    return { rate: rateData.data };
  }

  // create order on paycrest
  static createOrderPaycrest = async (payload: CreateOrder) => {
    const { rate } = await this.getRatePaycrest({ token: payload.token, amount: payload.amount, currency: "NGN", network: payload.network })
    const orderData = {
      amount: payload.amount,
      token: payload.token,
      network: payload.network,
      rate: rate,
      // rate: payload.rate,
      recipient: {
        institution: payload.bankName,
        accountIdentifier: payload.accountNumber,
        accountName: payload.accountName,
        currency: 'NGN',
        memo: 'Offramping from stableflow'
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
    });
    const order: any = await response.json()
    return { order, rate }
  }

  //withdrawal on blockradar
  static withdrawBlockradar = async (payload: WithdrawalType, user: User) => {
    // const business = await busiRepo.createQueryBuilder('busi').where('busi.owner_id =:ownerId', { ownerId: user.id }).getOne()
    // const wallet = await walletRepo.createQueryBuilder('wallet').where('wallet.business_id =:businessId', { businessId: business.id }).getOne()
    const walletId = envHelper.block_radar.wallet_id
    const headers = {
      "x-api-key": apiKey,
      "Content-Type": "application/json"
    }
    const asset = await fetch(`${b_baseUrl}/${walletId}/assets`, { headers: headers })
    if (!asset.ok) {
      throw new HttpException(400, asset.statusText)
    }
    const asset_res: any = await asset.json()
    const body = {
      assets: [{
        id: asset_res.data[0].id,
        address: payload.address,
        amount: payload.amount.toString(),
      }]
    }
    const url = `${b_baseUrl}/${walletId}/withdraw`;
    const options = {
      method: 'POST',
      headers: headers,
      body: JSON.stringify(body)
    };
    const response = await fetch(url, options);
    const data: any = await response.json();

    if (data.statusCode !== 200) {
      throw new HttpException(400, data.message)
    }
    return { message: 'Withdrawal request initiated initiated', data: data }
  }

  //webhook for paycrest
  // Server setup and webhook endpoint
  static webhookPaycrest = async (payload) => {
    console.log(payload.data)
    const offrampId = payload.data.id
    const transaction = await transRepo.createQueryBuilder('trans').where('trans.offrampOrderId =:offrampId ', { offrampId: offrampId }).getOne()
    console.log('trans', transaction)
    if (payload.data.status === 'settled') {
      transaction.status = TransactionStatus.SETTLED
      transaction.isSettled = true
      transaction.settledAt = new Date()
      await transRepo.save(transaction)
    }

    if (payload.data.status === "refunded") {
      transaction.status = TransactionStatus.REFUNDED
      await transRepo.save(transaction)
    }

    return payload
  }
}

// const data: any = await response.json()
// if (!business.auto_offramp) {
//   const newTrans = transRepo.create({
//     transaction_id: data.data.id,
//     business_id: business.id,
//     token_amount: parseFloat(data.data.amount),
//     fiat_amount: 0,
//     fiat_currency: 'ngn',
//     token: data.data.asset.symbol,
//     chain: data.data.asset.standard || "base",
//     token_logo: data.data.asset.logoUrl,
//     gatewayTxId: data.data.hash,
//     metadata: data.data.metadata,
//     type: "WITHDRAWAL",
//     txHash: data.data.blockHash,
//     senderAddress: data.data.senderAddress,
//     businessAddress: wallet.wallet_address,
//     address_id: wallet.address_id,
//     wallet_id: wallet.id,
//     exchange_rate: 0,
//     business: business
//   })
//   await transRepo.save(newTrans)
// }
