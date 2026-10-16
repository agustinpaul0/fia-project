import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTechnicalControlsRepository } from './technical-controls.repository'

const MISSING = '00000000-0000-4000-8000-0000000000ff'
const ACTIVE_AT = new Date('2099-03-02T00:00:00.000Z')
const BASE = {
  carNumber: 4,
  controlType: 'weight',
  status: 'passed',
  inspectedAt: '2099-03-01T10:00:00.000Z',
  expiresAt: '2099-03-08T10:00:00.000Z',
} as const

describe('DrizzleTechnicalControlsRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('guarda fecha, hora, vehículo y dictamen, y lo devuelve con sus nombres', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzleTechnicalControlsRepository(tx)
      const created = await repo.create({
        ...BASE,
        teamId: f.teamId,
        driverId: f.driverIds[0] ?? null,
        raceId: f.raceId,
      })
      expect(created).toMatchObject({
        ...BASE,
        teamName: 'Escudería test',
        driverName: 'Lando Norris',
        raceName: 'Gran Premio test',
        notes: null,
      })
      expect(await repo.driverBelongsToTeam(f.driverIds[0] ?? '', f.teamId)).toBe(true)
    }))

  it('lista sólo los vigentes y aplica los filtros', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzleTechnicalControlsRepository(tx)
      await repo.create({ ...BASE, teamId })
      await repo.create({ ...BASE, teamId, controlType: 'fuel', status: 'rejected' })
      await repo.create({ ...BASE, teamId, expiresAt: '2099-03-01T12:00:00.000Z' })
      const types = async (filter: object) =>
        (await repo.list({ activeAt: ACTIVE_AT, teamId, ...filter })).map((c) => c.controlType)
      expect((await types({})).sort()).toEqual(['fuel', 'weight'])
      expect(await types({ status: 'rejected' })).toEqual(['fuel'])
      expect(await types({ controlType: 'weight', season: 2099 })).toEqual(['weight'])
      expect(await types({ season: 2098 })).toEqual([])
    }))

  it.each([
    [{ teamId: MISSING }, 'TEAM_NOT_FOUND'],
    [{ raceId: MISSING }, 'RACE_NOT_FOUND'],
    [{ expiresAt: BASE.inspectedAt }, 'VALIDATION_FAILED'],
  ])('traduce el rechazo de la base de %o a %s', (override, code) =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzleTechnicalControlsRepository(tx)
      await expect(repo.create({ ...BASE, teamId, ...override })).rejects.toMatchObject({ code })
    }),
  )
})
