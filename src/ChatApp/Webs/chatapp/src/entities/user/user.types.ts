import { z } from 'zod'
import { UserSchema, UsersFilterQuerySchema } from './user.contracts'

export type User = z.infer<typeof UserSchema>
export type UsersByNameFilterQuery = z.infer<typeof UsersFilterQuerySchema>
