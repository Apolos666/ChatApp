import { z } from 'zod'
import { LoginDtoSchema } from "./auth.contracts";


export type LoginDto = z.infer<typeof LoginDtoSchema>