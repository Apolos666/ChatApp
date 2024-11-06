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

// Response
export const LoginResponseDtoSchema = z.object({
  id: z.number(),
  accessToken: z.string(),
  refreshToken: z.string(),
  email: z.string().email()
})