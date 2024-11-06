import { z } from 'zod'

// Request
export const LoginDtoSchema = z.object({
  email: z
    .string({ required_error: 'Email required!' })
    .min(1, { message: 'Email required!' })
    .email({ message: 'This email is invalid' }),
  password: z
    .string({ required_error: 'Password required!' })
    .min(1, { message: 'Password must be 6 characters or longer!' })
})

export const RegisterDtoSchema = z.object({
  name: z.string().min(1),
  phoneNumber: z.string().min(1),
  dob: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email().min(1),
  password: z.string().min(6)
})

export const ActivateAccountDtoSchema = z.object({
  email: z.string().email(),
  activationCode: z.string()
})

// Response
export const LoginResponseDtoSchema = z.object({
  id: z.number(),
  accessToken: z.string(),
  refreshToken: z.string(),
  email: z.string().email()
})