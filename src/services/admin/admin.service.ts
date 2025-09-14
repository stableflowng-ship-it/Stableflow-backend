// 

import { sendEmailBrevo } from "../../config/brevo.cofig"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { Transaction } from "../../entities/transaction/transaction.entity"
import { User } from "../../entities/user/user.entities"
import { BusiFilterType } from "../../utils/dataTypes/general.dataype"

const busiRepo = AppDataSource.getRepository(Business)
const userRepo = AppDataSource.getRepository(User)
const transactionRepo = AppDataSource.getRepository(Transaction)

export class AdminService {
  static approveBusiness = async (params: { id: string }) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :busiId', { busiId: params.id }).getOne()

    if (!business) {
      throw new HttpException(400, 'Business not found')
    }

    // if (business.onboarding_step === OnboardingStep.APPROVED) {
    //   return { message: 'Business already approved' }
    // }

    business.onboarding_step = OnboardingStep.APPROVED
    business.is_active = true
    business.is_verified = true
    // await WalletServive.generateWalletAddress({ busiId: business.id })
    await busiRepo.save(business)
    sendEmailBrevo({ htmlPath: "../email_templates/approved.html", subject: "Bussiness approved", to: business.email, html: {} }).catch(console.error)
    return { message: 'Business approved and wallet for the business has been generated' }
  }

  static getAllBusiness = async (filter: BusiFilterType) => {
    const page = parseInt(filter.page) || 1
    const limit = parseInt(filter.limit) || 25
    const state = filter.state || "ALL"
    const businesses = busiRepo.createQueryBuilder('busi').skip(page - 1).take(limit)

    if (state !== "ALL") {
      businesses.where('busi.onboarding_step = :state', { state })
    }
    const result = await businesses.getMany()
    return result
  }

  static getAllUsers = async () => {
    const users = await userRepo.createQueryBuilder('users').getMany()
    return users
  }

  static getAllTransactions = async () => {
    const trans = await transactionRepo.createQueryBuilder('trans').leftJoinAndSelect('trans.business', 'business').where("trans.status NOT IN (:...statuses)", { statuses: ["REFUNDED", "UNSETTLED", "PROCESSING"] }).getMany()
    return trans
  }

}