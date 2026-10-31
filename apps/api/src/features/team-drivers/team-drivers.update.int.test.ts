import { drivers, user } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTeamDriversRepository } from './team-drivers.repository'

const insertStaffUser = async (tx: DatabaseTransaction): Promise<string> => {
  const now = new Date()
  await tx.insert(user).values({
    id: 'staff-qa',
    name: 'Staff QA',
    email: 'staff-qa@escuderia.com',
    role: 'team_staff',
    createdAt: now,
    updatedAt: now,
  })
  return 'staff-qa'
}

describe('Modificación de pilotos (US-11, Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('guarda quién hizo el cambio y cuándo, y versiona la fila', () =>
    withRollback(connection, async (tx) => {
      const { driverIds } = await seedRacingFixture(tx)
      const id = driverIds[0] ?? ''
      const by = await insertStaffUser(tx)
      const repo = createDrizzleTeamDriversRepository(tx)
      const before = await repo.findById(id)
      const body = {
        firstName: 'Lando',
        lastName: 'Norris',
        code: 'NOR',
        number: 4,
        country: 'Reino Unido',
        license: 'FIA-04-NOR',
        role: 'reserve',
        version: 1,
      } as const
      const updated = await repo.update(id, body, by)
      expect(updated).toMatchObject({ role: 'reserve', version: 2, updatedByUserId: by })
      expect(updated?.updatedAt.getTime()).toBeGreaterThanOrEqual(before?.updatedAt.getTime() ?? 0)
      expect(await repo.update(id, body, by)).toBeNull()
      const [row] = await tx.select().from(drivers).where(eq(drivers.id, id))
      expect(row?.updatedByUserId).toBe(by)
      const listed = (await repo.listAll()).find((d) => d.id === id)
      expect(listed).toMatchObject({
        role: 'reserve',
        teamName: 'Escudería test',
        hasOfficialAccount: false,
      })
    }))
})
