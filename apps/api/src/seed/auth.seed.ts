import { user } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import type { BetterAuthInstance } from '../core/auth/better-auth'
import type { Database } from '../core/db/client'
import type { Env } from '../env'

export const seedAdminUser = async (
  db: Database,
  auth: BetterAuthInstance,
  env: Env,
): Promise<void> => {
  const existing = await db.select().from(user).where(eq(user.email, env.FIA_ADMIN_EMAIL)).limit(1)
  if (existing.length > 0) {
    return
  }
  await auth.api.signUpEmail({
    body: {
      email: env.FIA_ADMIN_EMAIL,
      password: env.FIA_ADMIN_PASSWORD,
      name: 'Administrador FIA',
    },
  })
  await db.update(user).set({ role: 'fia_admin' }).where(eq(user.email, env.FIA_ADMIN_EMAIL))
}
