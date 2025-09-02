// 
import { Type as T } from "@sinclair/typebox";
import { successDataSchema } from "../../utils/response.helper";
import { BankController } from "../../controllers/business/bank.controller";
import { isAuth } from "../../utils/middleware";

const bankSchema = T.Object({
  businessId: T.String(),
  bankCode: T.String(),
  bankName: T.String(),
  accountNumber: T.String(),
  accountName: T.String()
})

const verifySchema = T.Object({
  accountNumber: T.String(),
  bankCode: T.String()
})

export const createBankOpts = {
  schema: {
    tags: ['Businesses'],
    summary: "Add business bank account",
    body: bankSchema,
    response: {
      201: {
        description: 'Bank account',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: BankController.addBankAccount
}

export const fetchBanksOpts = {
  schema: {
    tags: ['Businesses'],
    summary: "Fetch list of banks",
    response: {
      200: {
        description: 'Bank list',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: BankController.fecthBanks
}

export const verifyBank = {
  schema: {
    tags: ['Businesses'],
    summary: "Verify bank account",
    query: verifySchema,
    response: {
      200: {
        description: 'Bank account',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: BankController.verifyBank
}

export const paycrestdBanks = {
  schema: {
    tags: ['Businesses'],
    summary: "Get paycrest banks",
    response: {
      200: {
        description: 'Banks',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: BankController.fetchSupportedBank
}

export const verifyBankPaycrest = {
  schema: {
    tags: ['Businesses'],
    summary: "Verify paycrest banks",
    query: verifySchema,
    response: {
      200: {
        description: 'Banks',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: BankController.verifyBankPaycrest
}