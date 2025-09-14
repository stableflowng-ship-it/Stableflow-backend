// 

import { AdminController } from "../../controllers/admin/admin.controller";
import { OnboardingStep } from "../../entities/business/business.entity";
import { isAuth } from "../../utils/middleware";
import { successDataSchema } from "../../utils/response.helper";
import { Type as T } from "@sinclair/typebox"


const getAllSch = T.Object({
  page: T.Optional(T.Number({ default: 1 })),
  limit: T.Optional(T.Number({ default: 25 })),
  state: T.Optional(T.Union([T.Literal('ALL'),
  T.Literal('NOT_STARTED'),
  T.Literal('BUSINESS_SETUP'),
  T.Literal('ACCOUNT_SETUP'),
  T.Literal('APPROVED'),], { default: 'ALL' }))
});

const busiId = T.Object({
  id: T.String({ format: "uuid" })
})

export const getAllBusiOpts = {
  schema: {
    tags: ['Admin'],
    summary: "Get all businesses",
    query: T.Optional(getAllSch),
    response: {
      200: {
        type: 'object',
        ...successDataSchema
      }
    }
  },
  // preHandler: [isAuth],
  handler: AdminController.getAllBusiness
}

export const approveBusiOpts = {
  schema: {
    tags: ['Admin'],
    summary: "Approve business",
    params: busiId,
    response: {
      200: {
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: AdminController.approveBusiness
}

export const getAllUser = {
  schema: {
    tags: ['Admin'],
    summary: "Get all user",
    response: {
      200: {
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: AdminController.getAllUsers
}

export const getTrans = {
  schema: {
    tags: ['Admin'],
    summary: "Get all Transactions",
    response: {
      200: {
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: AdminController.getAllTransactions
}