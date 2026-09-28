import { categories, teams, user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import type { DbExecutor } from '../../core/db/executor'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTeamStaffRepository } from './team-staff.repository'

describe('DrizzleTeamStaffRepository lecturas (Postgres real)', () => {
  let connection: DatabaseConnection
  const catId = '00000000-0000-4000-8000-000000000001'
  const teamId = '00000000-0000-4000-8000-000000000010'
  const userId = 'usr-test-1'

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })
  afterAll(async () => {
    await connection.close()
  })

  const seedPrerequisites = async (tx: DbExecutor): Promise<void> => {
    await tx.insert(categories).values({ id: catId, name: 'F1', code: 'F1' }).onConflictDoNothing()
    await tx
      .insert(teams)
      .values({ id: teamId, name: 'Ferrari', country: 'Italia', categoryId: catId })
      .onConflictDoNothing()
    await tx
      .insert(user)
      .values({
        id: userId,
        name: 'Admin',
        email: 'admin@fia.com',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
      .onConflictDoNothing()
  }

  it('crea, lee por id y lista ordenado con joins a user y teams', () =>
    withRollback(connection, async (tx) => {
      await seedPrerequisites(tx)
      const repo = createDrizzleTeamStaffRepository(tx)
      const created = await repo.create({
        userId,
        teamId,
        firstName: 'Charles',
        lastName: 'Leclerc',
        roleInTeam: 'Jefe',
        phoneNumber: '+54 9 291 1234567',
        fileNumber: 'LEG-1',
      })
      expect(created).toMatchObject({
        teamName: 'Ferrari',
        email: 'admin@fia.com',
        version: 1,
        isActive: true,
      })
      expect(await repo.findById(created.id)).toMatchObject({ id: created.id, fileNumber: 'LEG-1' })
      expect((await repo.findAll()).length).toBeGreaterThanOrEqual(1)
    }))
})
