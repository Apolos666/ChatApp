import { z } from 'zod'
import { UserDtoSchema } from './user.contracts'

export type UserDto = z.infer<typeof UserDtoSchema>