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

export const UsersByNameDtoSchema = z.object({
  totalElements: z.number(),
  totalPages: z.number(),
  pageSize: z.number(),
  pageNumber: z.number(),
  content: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      avatar: z.string().nullable()
    })
  ),
  last: z.boolean()
})

// Filter Query
export const UsersParamsDtoSchema = z.object({
  pageSize: z.number().min(10).nullable(),
  pageNumber: z.number().min(1).nullable(),
  name: z.string().min(1),
  sortBy: z.string().nullable(),
  sortDir: z.enum(['ASC', 'DESC']).nullable()
})