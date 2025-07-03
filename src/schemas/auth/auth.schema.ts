// 

import zodToJsonSchema from "zod-to-json-schema";
import { UserController } from "../../controllers/auth/auth.controller";
import { z } from 'zod';
import { successDataSchema } from "../../utils/response.helper";


const requestOtpSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});


const verifySchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
  otp: z.string().length(6, { message: "Otp Length must be 6" }),
});


export const requestOtpRouteOpts = {
  schema: {
    tags: ['Auth'],
    summary: "Request OTP for authentication",
    body: zodToJsonSchema(requestOtpSchema),
    response: {
      201: {
        description: 'OTP sent successfully',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: UserController.createOrSignIn
}

export const verifyAccoRouteOpts = {
  schema: {
    tags: ['Auth'],
    summary: "Verify account",
    body: zodToJsonSchema(verifySchema),
    response: {
      201: {
        description: 'Account verified',
        type: 'object',
        ...successDataSchema
      }
    }
  },
  handler: UserController.verifyAccount
}
