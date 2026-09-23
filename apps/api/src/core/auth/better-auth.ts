import { account, session, user, verification } from '@fia/shared/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins/admin'
import { bearer } from 'better-auth/plugins/bearer'
import type { Database } from '../db/client'

export type BetterAuthConfig = {
  readonly db: Database
  readonly secret: string
  readonly baseURL: string
  readonly trustedOrigins: readonly string[]
}

export const createBetterAuth = ({ db, secret, baseURL, trustedOrigins }: BetterAuthConfig) =>
  betterAuth({
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: { user, session, account, verification },
    }),
    secret,
    baseURL,
    trustedOrigins: [...trustedOrigins],
    emailAndPassword: {
      enabled: true,
      minPasswordLength: 12,
      maxPasswordLength: 128,
    },
    user: {
      additionalFields: {
        role: {
          type: 'string',
          required: false,
          defaultValue: 'public',
          input: false,
        },
        teamId: {
          type: 'string',
          required: false,
          defaultValue: null,
          input: false,
        },
      },
    },
    plugins: [admin({ defaultRole: 'public', adminRole: 'fia_admin' }), bearer()],
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
  })

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>
