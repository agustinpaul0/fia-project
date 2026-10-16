import { account, user } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { connectDatabase, type DatabaseConnection, type DatabaseTransaction } from '../db/client'
import { createBetterAuth } from './better-auth'

const EMAIL = 'qa.login@fia.com'
const PASSWORD = 'ContraseniaSegura123!'
const EIGHT_HOURS_MS = 8 * 60 * 60 * 1000

const authFor = (tx: DatabaseTransaction) =>
  createBetterAuth({
    db: tx,
    secret: 'secreto-de-prueba-con-mas-de-32-caracteres',
    baseURL: 'http://localhost:3000',
    trustedOrigins: ['http://localhost:5173'],
  })

const signUpAndIn = async (auth: ReturnType<typeof authFor>): Promise<Headers> => {
  await auth.api.signUpEmail({ body: { email: EMAIL, password: PASSWORD, name: 'QA' } })
  const { token } = await auth.api.signInEmail({ body: { email: EMAIL, password: PASSWORD } })
  return new Headers({ authorization: `Bearer ${token}` })
}

describe('Login con Better Auth (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('guarda la contraseña con hash y sal, nunca en texto plano', () =>
    withRollback(connection, async (tx) => {
      await signUpAndIn(authFor(tx))
      const [created] = await tx.select().from(user).where(eq(user.email, EMAIL))
      const [credential] = await tx
        .select()
        .from(account)
        .where(eq(account.userId, created?.id ?? ''))
      expect(credential?.password).toMatch(/^[0-9a-f]+:[0-9a-f]+$/)
      expect(credential?.password).not.toContain(PASSWORD)
    }))

  it('rechaza una contraseña incorrecta', () =>
    withRollback(connection, async (tx) => {
      const auth = authFor(tx)
      await signUpAndIn(auth)
      await expect(
        auth.api.signInEmail({ body: { email: EMAIL, password: 'OtraContrasenia123!' } }),
      ).rejects.toMatchObject({ statusCode: 401 })
    }))

  it('vence la sesión a las 8 horas sin actividad', () =>
    withRollback(connection, async (tx) => {
      const auth = authFor(tx)
      const found = await auth.api.getSession({ headers: await signUpAndIn(auth) })
      const expiresIn = (found?.session.expiresAt.getTime() ?? 0) - Date.now()
      expect(expiresIn).toBeGreaterThan(EIGHT_HOURS_MS - 60_000)
      expect(expiresIn).toBeLessThanOrEqual(EIGHT_HOURS_MS)
    }))

  it('invalida la sesión al cerrarla', () =>
    withRollback(connection, async (tx) => {
      const auth = authFor(tx)
      const headers = await signUpAndIn(auth)
      expect(await auth.api.getSession({ headers })).not.toBeNull()
      await auth.api.signOut({ headers })
      expect(await auth.api.getSession({ headers })).toBeNull()
    }))
})
