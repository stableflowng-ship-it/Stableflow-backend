// 
import { Type as T } from "@sinclair/typebox";
import { BusinessController } from "../../controllers/business/business.controller";
import { successDataSchema } from "../../utils/response.helper";
import { isAuth } from "../../utils/middleware";

const busiSchema = T.Object({
  name: T.String(),
  email: T.String({ format: "email" }),
  phone_number: T.String()
})

const getBusinessSch = T.Object({
  id: T.String({ format: 'uuid' }),
})


export const createBusiOpts = {
  schema: {
    tags: ['Businesses'],
    summary: "Create business account",
    body: T.Required(busiSchema),
    response: {
      201: {
        description: 'Account verified',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: BusinessController.createBusiness
}

export const getBusiOpts = {
  schema: {
    tags: ['Businesses'],
    summary: "Fecth business with ID",
    params: getBusinessSch,
    response: {
      200: {
        description: 'Business details',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: BusinessController.getBusiness
}

export const updateBusiOpts = {
  schema: {
    tags: ['Businesses'],
    summary: "Update business with ID",
    body: busiSchema,
    response: {
      200: {
        description: 'Business updated',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  preHandler: isAuth,
  handler: BusinessController.updateBusiness
}