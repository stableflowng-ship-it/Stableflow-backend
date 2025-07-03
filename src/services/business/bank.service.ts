// 

import HttpException from "../../config/error.config";
import { AppDataSource } from "../../data-source";
import { BankDetails } from "../../entities/business/bank-details.entity";
import { Business } from "../../entities/business/business.entity";
import { User } from "../../entities/user/user.entities";
import { BankType } from "../../utils/dataTypes/bank.datatype";


const busiRepo = AppDataSource.getRepository(Business)
const bankRepo = AppDataSource.getRepository(BankDetails)

export class BankService {
  static addBankAccount = async (payload: BankType, user: User) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :businessId', { businessId: payload.businessId }).getOne()
    if (!business) {
      throw new HttpException(400, 'Business doesn\'t exist')
    }
    const newBank = new BankDetails
    newBank.accountName = payload.accountName
    newBank.accountNumber = payload.accountNumber
    newBank.bankCode = payload.bankCode
    newBank.bankName = payload.bankName
    newBank.businessId = payload.businessId
    newBank.business = business

    await bankRepo.save(newBank)

    return 'Business bank created'
  }
}