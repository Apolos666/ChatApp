import { z } from 'zod'

export const CreateRoomDtoSchema = z.object({
  name: z.string().min(1)
})

export const CreateRoomResponseDtoSchema = z.object({
  id: z.number(),
  name: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
  creatorId: z.number(),
  members: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      email: z.string(),
      avatar: z.string().nullable()
    })
  )
})
