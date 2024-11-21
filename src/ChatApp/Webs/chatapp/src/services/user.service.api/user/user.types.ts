import { z } from 'zod'
import { 
  UpdateUserAvatarSchema,
  UpdateUserDtoSchema,
  UserDtoSchema,
  UsersByNameDtoSchema,
  UsersParamsDtoSchema
} from './user.contracts'

// Request
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>
export type UpdateUserAvatarDto = z.infer<typeof UpdateUserAvatarSchema>
// Response
export type UserDto = z.infer<typeof UserDtoSchema>
export type UsersByNameDto = z.infer<typeof UsersByNameDtoSchema>
// Query Params
export type UsersParamsQueryDto = z.infer<typeof UsersParamsDtoSchema>
