import { categories, teams, user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import type { DbExecutor } from '../../core/db/executor'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTeamStaffRepository } from './team-staff.repository'

describe('DrizzleTeamStaffRepository escrituras (Postgres real)', () => {
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

  it('traduce violación de legajo único a STAFF_FILE_NUMBER_ALREADY_EXISTS', () =>
    withRollback(connection, async (tx) => {
      await seedPrerequisites(tx)
      const repo = createDrizzleTeamStaffRepository(tx)
      const base = {
        userId,
        teamId,
        roleInTeam: 'C',
        phoneNumber: '+54 9 291 1234567',
        fileNumber: 'LEG-DUP',
      }
      await repo.create({ ...base, firstName: 'A', lastName: 'B' })
      await expect(repo.create({ ...base, firstName: 'X', lastName: 'Y' })).rejects.toMatchObject({
        code: 'STAFF_FILE_NUMBER_ALREADY_EXISTS',
      })
    }))

  it('actualiza y da de baja respetando versión optimista', () =>
    withRollback(connection, async (tx) => {
      await seedPrerequisites(tx)
      const repo = createDrizzleTeamStaffRepository(tx)
      const created = await repo.create({
        userId,
        teamId,
        firstName: 'A',
        lastName: 'B',
        roleInTeam: 'C',
        phoneNumber: '+54 9 291 1234567',
        fileNumber: 'LEG-V',
      })
      const upd = {
        teamId,
        firstName: 'A2',
        lastName: 'B2',
        roleInTeam: 'C2',
        phoneNumber: '+54 9 291 1234567',
      }
      const updated = await repo.update(created.id, { ...upd, version: 1 })
      expect(updated?.version).toBe(2)
      expect(await repo.update(created.id, { ...upd, version: 1 })).toBeNull()

      const deact = await repo.deactivate(created.id, {
        version: 2,
        deactivatedBy: userId,
        deactivatedAt: new Date(),
      })
      expect(deact?.isActive).toBe(false)
      expect(deact?.version).toBe(3)
    }))
})
