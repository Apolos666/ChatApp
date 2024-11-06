import { z } from 'zod'
import { 
  ActivateAccountDtoSchema,
  LoginDtoSchema,
  RegisterDtoSchema
} from "./auth.contracts";

export type LoginDto = z.infer<typeof LoginDtoSchema>
export type RegisterDto = z.infer<typeof RegisterDtoSchema>
export type ActivateAccountDto = z.infer<typeof ActivateAccountDtoSchema>