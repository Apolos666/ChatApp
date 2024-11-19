import { z } from 'zod'
import { 
  ActivateAccountDtoSchema,
  ChangePasswordDtoSchema,
  LoginDtoSchema,
  RegisterDtoSchema,
  ResetPasswordDtoSchema
} from "./auth.contracts";

export type LoginDto = z.infer<typeof LoginDtoSchema>
export type RegisterDto = z.infer<typeof RegisterDtoSchema>
export type ResetPasswordDto = z.infer<typeof ResetPasswordDtoSchema>
export type ChangePasswordDto = z.infer<typeof ChangePasswordDtoSchema>
export type ActivateAccountDto = z.infer<typeof ActivateAccountDtoSchema>