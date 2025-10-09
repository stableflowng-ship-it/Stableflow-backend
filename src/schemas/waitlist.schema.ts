// 
import { Type as T } from "@sinclair/typebox";
import { successDataSchema } from "../utils/response.helper";
import { WaitlistController } from "../controllers/waitlist.controller";

export const waitlistOpts = {
  schema: {
    tags: ["Waitlist"],
    summary: 'Waitlist',
    body: T.Object({ email: T.String({ format: "email" }) }),
    response: {
      201: {
        description: 'Waitlist joined',
        type: 'object',
        ...successDataSchema
      }
    },
  },
  handler: WaitlistController.joinWaitlist
}