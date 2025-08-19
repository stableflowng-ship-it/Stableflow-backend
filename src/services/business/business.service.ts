// 

import HttpException from "../../config/error.config"
import { AppDataSource } from "../../data-source"
import { Business } from "../../entities/business/business.entity"
import { User } from "../../entities/user/user.entities"
import { BusinessType } from "../../utils/dataTypes/business.datatypes"

const busiRepo = AppDataSource.getRepository(Business)
// const userRepo = AppDataSource.getRepository(User)


export class BusinessService {
  static createBusiness = async (user: User, payload: BusinessType) => {
    const newBusiness = new Business
    newBusiness.owner = user
    newBusiness.owner_id = user.id
    newBusiness.email = payload.email
    newBusiness.phone_number = payload.phone_number
    newBusiness.name = payload.name

    const saved = await busiRepo.save(newBusiness)

    return "Business created"
  }

  static getBusiness = async (params: { id: string }, user: User) => {
    const getBusi = await busiRepo.createQueryBuilder('busi').where('busi.id = :id', { id: params.id }).getOne()

    if (getBusi.owner_id !== user.id) {
      throw new HttpException(401, 'You are not authorize to access this')
    }
    return getBusi
  }

  static updateBusiness = async (user: User, payload: BusinessType) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :id').getOne()
    if (!business) {
      throw new HttpException(400, 'Business not found')
    }
    if (business.owner_id !== user.id) {
      throw new HttpException(401, 'You are unauthorize to access this')
    }
    business.name = payload.name
    business.phone_number = payload.phone_number
    await busiRepo.save(business)
    return business
  }
}