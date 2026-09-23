import type { Context } from 'hono'
import type { z } from 'zod'

export const ok = <Schema extends z.ZodType>(
  c: Context,
  schema: Schema,
  data: z.input<Schema>,
): Response => c.json(schema.parse(data), { status: 200 })

export const created = <Schema extends z.ZodType>(
  c: Context,
  schema: Schema,
  data: z.input<Schema>,
): Response => c.json(schema.parse(data), { status: 201 })

export const noContent = (c: Context): Response => c.body(null, 204)
