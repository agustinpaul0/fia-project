import { categories, teams } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { seedRacingFixture } from '../../testing/integration/racing-fixture'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleTeamDriversRepository } from './team-drivers.repository'

const BODY = {
  firstName: 'Franco',
  lastName: 'Colapinto',
  code: 'QAC',
  number: 77,
  country: 'Argentina',
  license: 'FIA-77-QAC',
  role: 'reserve',
} as const

describe('DrizzleTeamDriversRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('inscribe un piloto con su licencia en la nómina de la escudería', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzleTeamDriversRepository(tx)
      const created = await repo.create(teamId, BODY)
      expect(created).toMatchObject({ ...BODY, teamId, version: 1 })
      const list = await repo.listByTeam(teamId)
      expect(list.map((d) => d.number)).toEqual([1, 4, 77, 81])
    }))

  it('busca por número y por código, y cuenta por condición', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzleTeamDriversRepository(tx)
      await repo.create(teamId, BODY)
      expect((await repo.findByNumber(teamId, 77))?.code).toBe('QAC')
      expect((await repo.findByCode('QAC'))?.number).toBe(77)
      expect(await repo.findByNumber(teamId, 98)).toBeNull()
      expect(await repo.findByCode('ZZZ')).toBeNull()
      expect(await repo.countByTeamAndRole(teamId, 'main')).toBe(3)
      expect(await repo.countByTeamAndRole(teamId, 'reserve')).toBe(1)
    }))

  it.each([
    [{ license: 'AB' }, 'VALIDATION_FAILED'],
    [{ license: 'FIA 77/QAC' }, 'VALIDATION_FAILED'],
    [{ number: 4 }, 'CAR_NUMBER_ALREADY_TAKEN'],
    [{ code: 'NOR' }, 'DRIVER_CODE_ALREADY_TAKEN'],
  ])('la base rechaza %o con %s aunque se saltee el servicio', (override, code) =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const repo = createDrizzleTeamDriversRepository(tx)
      await expect(repo.create(teamId, { ...BODY, ...override })).rejects.toMatchObject({ code })
    }),
  )

  it('permite repetir el dorsal en otra categoría pero no la licencia', () =>
    withRollback(connection, async (tx) => {
      const { teamId } = await seedRacingFixture(tx)
      const [other] = await tx
        .insert(categories)
        .values({ name: 'Otra categoría', code: 'OC' })
        .returning({ id: categories.id })
      const [otherTeam] = await tx
        .insert(teams)
        .values({ name: 'Escudería OC', country: 'Italia', categoryId: other?.id ?? '' })
        .returning({ id: teams.id })
      const repo = createDrizzleTeamDriversRepository(tx)
      const otherTeamId = otherTeam?.id ?? ''
      expect(await repo.findByNumber(otherTeamId, 4)).toBeNull()
      const created = await repo.create(otherTeamId, { ...BODY, number: 4 })
      expect(created).toMatchObject({ number: 4, categoryId: other?.id })
      await expect(repo.create(teamId, { ...BODY, code: 'QAD' })).rejects.toMatchObject({
        code: 'LICENSE_ALREADY_TAKEN',
      })
    }))
})
