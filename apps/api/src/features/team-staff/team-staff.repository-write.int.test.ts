import { categories, teams, user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import type { DbExecutor } from '../../core/db/executor'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { buildCreateTeamStaffBody } from '../../testing/team-staff-builders'
import { createDrizzleTeamStaffRepository } from './team-staff.repository'

describe('DrizzleTeamStaffRepository escrituras (Postgres real)', () => {
  let connection: DatabaseConnection
  const catId = '00000000-0000-4000-8000-000000000001'
  const teamId = '00000000-0000-4000-8000-000000000010'
  const userId = 'usr-test-1'
  const otherUserId = 'usr-test-2'
  const { roleInTeam, phoneNumber } = buildCreateTeamStaffBody()

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
    const now = new Date()
    await tx
      .insert(user)
      .values([
        { id: userId, name: 'Admin', email: 'admin@fia.com', createdAt: now, updatedAt: now },
        { id: otherUserId, name: 'Otro', email: 'otro@fia.com', createdAt: now, updatedAt: now },
      ])
      .onConflictDoNothing()
  }

  it('traduce violación de legajo único a STAFF_FILE_NUMBER_ALREADY_EXISTS', () =>
    withRollback(connection, async (tx) => {
      await seedPrerequisites(tx)
      const repo = createDrizzleTeamStaffRepository(tx)
      const base = {
        userId,
        teamId,
        roleInTeam,
        phoneNumber,
        fileNumber: 'LEG-DUP',
      }
      await repo.create({ ...base, firstName: 'A', lastName: 'B' })
      const duplicate = { ...base, userId: otherUserId, firstName: 'X', lastName: 'Y' }
      await expect(repo.create(duplicate)).rejects.toMatchObject({
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
        roleInTeam,
        phoneNumber,
        fileNumber: 'LEG-V',
      })
      const upd = {
        teamId,
        firstName: 'A2',
        lastName: 'B2',
        roleInTeam: 'Director Deportivo',
        phoneNumber,
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
