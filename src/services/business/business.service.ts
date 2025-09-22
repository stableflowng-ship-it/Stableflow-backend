// 

import { sendEmailBrevo } from "../../config/brevo.cofig"
import { envHelper } from "../../config/env.helper"
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
    newBusiness.email = user.email
    newBusiness.phone_number = payload.phone_number
    newBusiness.name = payload.name
    newBusiness.category_name = payload.category_name

    const saved = await busiRepo.save(newBusiness)

    sendEmailBrevo({ htmlPath: "../email_templates/new_business.html", subject: "We have a new Business", to: envHelper.admin_emal, html: { name: saved.name, id: saved.id, cat: saved.category_name } })

    return { message: "Business created", data: saved }
  }

  static getBusiness = async (params: { id: string }, user: User) => {
    const getBusi = await busiRepo.createQueryBuilder('busi').where('busi.id = :id', { id: params.id }).getOne()

    if (getBusi.owner_id !== user.id) {
      throw new HttpException(401, 'You are not authorize to access this')
    }
    return getBusi
  }

  static getUserBusiness = async (user: User) => {
    const getBusi = await busiRepo.createQueryBuilder('busi').leftJoinAndSelect('busi.bankDetails', 'bankDetails').where('busi.owner_id = :ownerId', { ownerId: user.id }).getOne()
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