import { z } from 'zod'

export const healthResponseSchema = z.strictObject({
  status: z.literal('ok'),
  database: z.enum(['up', 'down']),
})

export type HealthResponse = z.infer<typeof healthResponseSchema>
