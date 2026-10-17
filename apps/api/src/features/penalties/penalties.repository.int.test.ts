import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzlePenaltiesRepository } from './penalties.repository'

const MISSING = '00000000-0000-4000-8000-0000000000ff'
const SINCE = new Date('2094-01-01T00:00:00.000Z')

describe('DrizzlePenaltiesRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('guarda la sanción y la devuelve con escudería, piloto y carrera', () =>
    withRollback(connection, async (tx) => {
      const f = await seedRacingFixture(tx)
      const repo = createDrizzlePenaltiesRepository(tx)
      const created = await repo.create({
        teamId: f.teamId,
        driverId: f.driverIds[0] ?? null,
        raceId: f.raceId,
        type: 'time_penalty',
        penalty: '5 segundos',
        reason: 'Exceder los límites de pista.',
        issuedAt: '2099-03-01T16:00:00.000Z',
      })
      expect(created).toMatchObject({
        teamName: 'Escudería test',
        categoryCode: 'CT',
        driverName: 'Lando Norris',
        raceName: 'Gran Premio test',
        issuedAt: '2099-03-01T16:00:00.000Z',
      })
      expect(await repo.driverBelongsToTeam(f.driverIds[0] ?? '', f.teamId)).toBe(true)
      expect(await repo.driverBelongsToTeam(MISSING, f.teamId)).toBe(false)
    }))

  it('filtra por temporada, escudería y tipo, y oculta las de más de 5 años', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzlePenaltiesRepository(tx)
      const base = { teamId, penalty: 'Multa', reason: 'Motivo de prueba.' }
      await repo.create({ ...base, type: 'fine', issuedAt: '2099-05-01T00:00:00.000Z' })
      await repo.create({ ...base, type: 'reprimand', issuedAt: '2098-05-01T00:00:00.000Z' })
      await repo.create({ ...base, type: 'fine', issuedAt: '2093-05-01T00:00:00.000Z' })
      const types = async (filter: object) =>
        (await repo.list({ issuedSince: SINCE, teamId, ...filter })).map((p) => p.type)
      expect(await types({})).toEqual(['fine', 'reprimand'])
      expect(await types({ season: 2098 })).toEqual(['reprimand'])
      expect(await types({ type: 'fine' })).toEqual(['fine'])
      expect(await types({ teamId: MISSING })).toEqual([])
    }))

  it.each([
    [{ teamId: MISSING }, 'TEAM_NOT_FOUND'],
    [{ raceId: MISSING }, 'RACE_NOT_FOUND'],
    [{ reason: 'Ok' }, 'VALIDATION_FAILED'],
  ])('traduce el rechazo de la base de %o a %s', (override, code) =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzlePenaltiesRepository(tx)
      const body = { teamId, type: 'fine', penalty: 'Multa', reason: 'Motivo de prueba.' } as const
      await expect(repo.create({ ...body, ...override })).rejects.toMatchObject({ code })
    }),
  )
})
