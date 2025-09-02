// 

import { sendEmailBrevo } from "../../config/brevo.cofig"
import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business, OnboardingStep } from "../../entities/business/business.entity"
import { BusiFilterType } from "../../utils/dataTypes/general.dataype"

const busiRepo = AppDataSource.getRepository(Business)

export class AdminService {
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
}