import { z } from 'zod'
import { CreateRoomDtoSchema, CreateRoomResponseDtoSchema } from './room.contracts'

export type CreateRoomDto = z.infer<typeof CreateRoomDtoSchema>
export type CreateRoomResponseDto = z.infer<typeof CreateRoomResponseDtoSchema>