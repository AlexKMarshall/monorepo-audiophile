import { z } from 'zod'

export const slugZodSchema = z.object({
  current: z.string(),
})
