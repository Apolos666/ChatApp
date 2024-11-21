import { z } from 'zod'

export const UsersFilterQuerySchema = z.object({
  pageSize: z.number().nullable(),
  pageNumber: z.number().nullable(),
  name: z.string().min(1),
  sortBy: z.string().nullable(),
  sortDir: z.enum(['ASC', 'DESC']).nullable()
})

export const UserSchema = z.object({
  id: z.number(),
  name: z.string(),
  phoneNumber: z.string(),
  dob: z.string(),
  address: z.string(),
  email: z.string().email(),
  avatar: z.string().nullable(),
  role: z.object({
    id: z.number(),
    name: z.string()
  })
})