// 
import { Type as T } from "@sinclair/typebox";
import { TransactionController } from "../../controllers/transaction/transaction.controller";
import { isAuth } from "../../utils/middleware";
import { successDataSchema } from "../../utils/response.helper";


export const getBusiTrans = {
  schema: {
    tags: ['Transactions'],
    summary: "Get business transactions",
    param: T.Object({
      businessId: T.String()
    }),
    response: {
      201: {
        description: 'Business transactions',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: TransactionController.getBusinessTransactions
}