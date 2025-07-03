// 

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
    const busi = await busiRepo.createQueryBuilder('busi').where('busi.id = :busiId', { busiId: params.id }).getOne()

    if (!busi) {
      throw new HttpException(400, 'Business not found')
    }

    if (busi.onboarding_step === OnboardingStep.APPROVED) {
      return { message: 'Business already approved' }
    }

    busi.onboarding_step = OnboardingStep.APPROVED
    await busiRepo.save(busi)

    return { message: 'Business approved' }
  }
}