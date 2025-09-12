// 

import { envHelper } from "../../config/env.helper";
import HttpException from "../../config/error.config";
import { AppDataSource } from "../../data-source";
import { BankDetails } from "../../entities/business/bank-details.entity";
import { Business } from "../../entities/business/business.entity";
import { User } from "../../entities/user/user.entities";
import { BankType } from "../../utils/dataTypes/bank.datatype";


const busiRepo = AppDataSource.getRepository(Business)
const bankRepo = AppDataSource.getRepository(BankDetails)

const paystack = 'https://api.paystack.co/'
const url = 'https://nubapi.com/banks';


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


  static fecthBanks = async () => {
    const response = await fetch(`${paystack}bank?country=nigeria`, { method: 'GET', headers: { 'content-type': 'application/json' } })
    if (!response.ok) {
      throw new HttpException(400, 'Unable to fetch banks')
    }
    const data = await response.json()
    return data
  }

  static verifyBank = async (payload: { accountNumber: string, bankCode: string }) => {
    const verifyUrl = `${paystack}bank/resolve?account_number=${payload.accountNumber}&bank_code=${payload.bankCode}`
    const response = await fetch(verifyUrl, {
      method: 'GET',
      headers: { 'content-type': 'application/json', Authorization: `Bearer ${envHelper.paystack.secret_key}`, }
    })

    if (!response.ok) {
      throw new HttpException(400, response.statusText || 'Unable to verify bank account')
    }
    const data = await response.json()
    return data
  }

  //for paycrest

  static fetchSupportedBank = async () => {
    const url = 'https://api.paycrest.io/v1/institutions/ngn'
    const options = { method: 'GET' }
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new HttpException(400, response.statusText)
    }
    const data = await response.json();
    return data
  }

  static verifyBankPaycrest = async (payload: { accountNumber: string, bankCode: string }) => {
    const url = 'https://api.paycrest.io/v1/verify-account';
    const body = {
      institution: payload.bankCode,
      accountIdentifier: payload.accountNumber
    }
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    };
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new HttpException(400, 'Bank not found!')
    }
    const data: any = await response.json();
    if (data?.data === "OK") {
      throw new HttpException(400, 'Bank not found!')
    }
    return data
  }
}