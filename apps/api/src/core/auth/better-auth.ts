import { account, session, user, verification } from '@fia/shared/db'
import { betterAuth } from 'better-auth'
import { drizzleAdapter } from 'better-auth/adapters/drizzle'
import { admin } from 'better-auth/plugins/admin'
import { bearer } from 'better-auth/plugins/bearer'
import type { TransactionalDatabase } from '../db/client'

import { ADMIN_ROLES, authRoles } from './better-auth-roles'

export type BetterAuthConfig = {
  readonly db: TransactionalDatabase
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
        teamId: {
          type: 'string',
          required: false,
          defaultValue: null,
          input: false,
        },
      },
    },
    plugins: [
      admin({
        defaultRole: 'public',
        adminRoles: [...ADMIN_ROLES],
        roles: authRoles,
      }),
      bearer(),
    ],
    rateLimit: {
      enabled: true,
      window: 60,
      max: 10,
    },
  })

export type BetterAuthInstance = ReturnType<typeof createBetterAuth>
