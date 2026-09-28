import { session, user } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { createBetterAuth } from '../../core/auth/better-auth'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { buildCreateTeamStaffBody } from '../../testing/team-staff-builders'
import { createDrizzleStaffAccountsAdapter } from './team-staff-accounts.adapter'

const { email, password, teamId } = buildCreateTeamStaffBody()
const ACCOUNT = { email, password, name: 'Charles Leclerc', role: 'team_staff', teamId } as const

const adapterFor = (tx: DatabaseTransaction) =>
  createDrizzleStaffAccountsAdapter(
    createBetterAuth({
      db: tx,
      secret: 'secreto-de-prueba-con-mas-de-32-caracteres',
      baseURL: 'http://localhost:3000',
      trustedOrigins: ['http://localhost:5173'],
    }),
  )

const findUser = async (tx: DatabaseTransaction, id: string) =>
  (await tx.select().from(user).where(eq(user.id, id)))[0]

describe('Adaptador de cuentas con Better Auth (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('crea la cuenta con rol team_staff y su escudería', () =>
    withRollback(connection, async (tx) => {
      const { userId } = await adapterFor(tx).createAccount(ACCOUNT)
      expect(await findUser(tx, userId)).toMatchObject({ email, role: 'team_staff', teamId })
    }))

  it('traduce un email repetido a USER_ALREADY_EXISTS', () =>
    withRollback(connection, async (tx) => {
      const adapter = adapterFor(tx)
      await adapter.createAccount(ACCOUNT)
      await expect(adapter.createAccount(ACCOUNT)).rejects.toMatchObject({
        code: 'USER_ALREADY_EXISTS',
      })
    }))

  it('actualiza el nombre y la escudería de la cuenta', () =>
    withRollback(connection, async (tx) => {
      const adapter = adapterFor(tx)
      const { userId } = await adapter.createAccount(ACCOUNT)
      const newTeamId = '00000000-0000-4000-8000-000000000099'
      await adapter.updateAccount(userId, { name: 'Carlos Sainz', teamId: newTeamId })
      expect(await findUser(tx, userId)).toMatchObject({ name: 'Carlos Sainz', teamId: newTeamId })
    }))

  it('la baja bloquea la cuenta y cierra todas sus sesiones', () =>
    withRollback(connection, async (tx) => {
      const adapter = adapterFor(tx)
      const { userId } = await adapter.createAccount(ACCOUNT)
      const now = new Date()
      const expiresAt = new Date(now.getTime() + 60_000)
      await tx.insert(session).values({
        id: 'ses-1',
        token: 'tok-1',
        userId,
        expiresAt,
        createdAt: now,
        updatedAt: now,
      })
      await adapter.banAccount(userId)
      expect(await findUser(tx, userId)).toMatchObject({ banned: true })
      expect(await tx.select().from(session).where(eq(session.userId, userId))).toEqual([])
    }))
})
