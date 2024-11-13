import { z } from 'zod'
import { 
  UpdateUserAvatarSchema,
  UpdateUserDtoSchema,
  UserDtoSchema
} from './user.contracts'

// Request
export type UpdateUserDto = z.infer<typeof UpdateUserDtoSchema>
export type UpdateUserAvatarDto = z.infer<typeof UpdateUserAvatarSchema>

// Response
export type UserDto = z.infer<typeof UserDtoSchema>