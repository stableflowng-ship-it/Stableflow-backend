// 

import { AppDataSource } from "../../data-source"
import { Business } from "../../entities/business/business.entity"
import { User } from "../../entities/user/user.entities"
import HttpException from "../../config/error.config"
import { Transaction } from "../../entities/transaction/transaction.entity"


const transactionRepo = AppDataSource.getRepository(Transaction)
const busiRepo = AppDataSource.getRepository(Business)

export class TransactionService {

  static getBusinessTransactions = async (businessId: string, user: User) => {
    const business = await busiRepo.createQueryBuilder('busi').where('busi.id = :businessId', { businessId }).getOne()
    if (!business) {
      throw new HttpException(400, "Business doesn't exist")
    }
    if (business.owner_id !== user.id) {
      throw new HttpException(403, 'Forbidden')
    }
    const transactions = await transactionRepo.createQueryBuilder('trans').where('trans.business_id = :businessId', { businessId }).orderBy('busi.receivedAt', 'DESC').getMany()
    return transactions
  }
}