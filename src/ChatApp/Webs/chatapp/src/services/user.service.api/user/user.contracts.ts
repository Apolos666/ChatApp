import { z } from 'zod'

export const UserDto = z.object({
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

// Request
export const UpdateUserDtoSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  dob: z.string(),
  address: z.string()
})

export const UpdateUserAvatarSchema = z.object({
  file: z.instanceof(Blob).optional().nullable()
})

// Response
export const UserDtoSchema = UserDto