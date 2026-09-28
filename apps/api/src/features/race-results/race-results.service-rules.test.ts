import { beforeEach, describe, expect, it } from 'vitest'
import { aDriver, classificationBody, TEST_NOW } from '../../testing/race-builders'
import {
  createRaceServiceFixture,
  DRIVER_WITHOUT_TEAM,
  DRIVERS,
  FUTURE_RACE,
  MISSING_RACE_ID,
  OTHER_CATEGORY_DRIVER,
  RACE,
  type RaceServiceFixture,
} from '../../testing/race-service-fixture'

describe('RaceResultsService: reglas de carga', () => {
  let fixture: RaceServiceFixture

  beforeEach(() => {
    fixture = createRaceServiceFixture()
  })

  it.each([
    {
      caso: 'la carrera no existe',
      raceId: MISSING_RACE_ID,
      list: DRIVERS,
      code: 'RACE_NOT_FOUND',
    },
    { caso: 'no se corrió', raceId: FUTURE_RACE.id, list: DRIVERS, code: 'RACE_NOT_FINISHED' },
    { caso: 'un piloto no existe', raceId: RACE.id, list: [aDriver(50)], code: 'DRIVER_NOT_FOUND' },
    {
      caso: 'hay otra categoría',
      raceId: RACE.id,
      list: [OTHER_CATEGORY_DRIVER],
      code: 'DRIVER_NOT_IN_CATEGORY',
    },
    {
      caso: 'falta escudería',
      raceId: RACE.id,
      list: [DRIVER_WITHOUT_TEAM],
      code: 'DRIVER_NOT_IN_CATEGORY',
    },
  ])('rechaza la carga si $caso', async ({ raceId, list, code }) => {
    const attempt = fixture.service.saveClassification(raceId, classificationBody(list))
    await expect(attempt).rejects.toMatchObject({ code })
  })

  it('rechaza guardar con una versión vieja', async () => {
    await fixture.service.saveClassification(RACE.id, classificationBody(DRIVERS))
    const stale = fixture.service.saveClassification(RACE.id, classificationBody(DRIVERS))
    await expect(stale).rejects.toMatchObject({ code: 'STALE_VERSION' })
  })

  it('una carrera que termina justo ahora ya se puede cargar', async () => {
    fixture.repository.races.set(RACE.id, { ...RACE, date: TEST_NOW })
    const saved = fixture.service.saveClassification(RACE.id, classificationBody(DRIVERS))
    await expect(saved).resolves.toBeDefined()
  })
})
