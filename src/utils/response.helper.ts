// 
import { Type as T } from "@sinclair/typebox";

export const successData = {
  data: [],
  status: true,
  message: '',
  code: 200,
}

export const failureData = {
  data: [],
  status: false,
  code: 400,
  error: '',
}


export const successDataSchema = T.Object({
  data: T.Any(),
  status: T.Boolean(),
  message: T.String(),
  code: T.Number(),
})