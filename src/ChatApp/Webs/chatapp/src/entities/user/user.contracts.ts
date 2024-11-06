import { z } from 'zod'

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  phoneNumber: z.string(),
  dob: z.string(),
  address: z.string(),
  email: z.string().email(),
  role: z.object({
    id: z.number(),
    name: z.string()
  })
})