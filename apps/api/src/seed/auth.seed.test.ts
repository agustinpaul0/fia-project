import { describe, expect, it, vi } from 'vitest'
import type { BetterAuthInstance } from '../core/auth/better-auth'
import type { Database } from '../core/db/client'
import type { Env } from '../env'
import { seedAdminUser } from './auth.seed'

const ENV = {
  FIA_ADMIN_EMAIL: 'admin@fia.com',
  FIA_ADMIN_PASSWORD: 'AdminPassword123!',
} as Env

describe('seedAdminUser', () => {
  it('crea el usuario admin y le asigna el rol fia_admin si no existe', async () => {
    const signUpEmail = vi.fn().mockResolvedValue({})
    const auth = { api: { signUpEmail } } as unknown as BetterAuthInstance
    const db = {
      select: () => ({ from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }) }),
      update: () => ({ set: () => ({ where: () => Promise.resolve() }) }),
    } as unknown as Database

    await seedAdminUser(db, auth, ENV)
    expect(signUpEmail).toHaveBeenCalledWith({
      body: {
        email: ENV.FIA_ADMIN_EMAIL,
        password: ENV.FIA_ADMIN_PASSWORD,
        name: 'Administrador FIA',
      },
    })
  })

  it('no crea el usuario si ya existe', async () => {
    const signUpEmail = vi.fn()
    const auth = { api: { signUpEmail } } as unknown as BetterAuthInstance
    const db = {
      select: () => ({
        from: () => ({ where: () => ({ limit: () => Promise.resolve([{ id: '1' }]) }) }),
      }),
    } as unknown as Database

    await seedAdminUser(db, auth, ENV)
    expect(signUpEmail).not.toHaveBeenCalled()
  })
})
