import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  API_PORT: z.coerce.number().int().positive().default(3000),
  WEB_ORIGIN: z.url(),
  DATABASE_URL: z.url(),
  BETTER_AUTH_SECRET: z
    .string()
    .min(32)
    .default('development-secret-must-be-at-least-32-chars-long'),
  BETTER_AUTH_URL: z.string().default('http://localhost:3000'),
  FIA_ADMIN_EMAIL: z.string().email().default('admin@fia.com'),
  FIA_ADMIN_PASSWORD: z.string().default('AdminPassword123!'),
})

export type Env = z.infer<typeof envSchema>

export const loadEnv = (source: NodeJS.ProcessEnv): Env => envSchema.parse(source)
