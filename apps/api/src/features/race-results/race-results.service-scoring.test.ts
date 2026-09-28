import { beforeEach, describe, expect, it } from 'vitest'
import { classificationBody } from '../../testing/race-builders'
import {
  createRaceServiceFixture,
  DRIVERS,
  RACE,
  type RaceServiceFixture,
  SPRINT,
} from '../../testing/race-service-fixture'

describe('RaceResultsService: puntos y revisiones', () => {
  let fixture: RaceServiceFixture

  beforeEach(() => {
    fixture = createRaceServiceFixture()
  })

  it('calcula los puntos de Gran Premio según la posición', async () => {
    const saved = await fixture.service.saveClassification(RACE.id, classificationBody(DRIVERS))
    expect(saved.results.map((r) => r.points)).toEqual([25, 18, 15, 12, 10, 8, 6, 4, 2, 1, 0, 0])
    expect(saved.results.map((r) => r.position)).toEqual(DRIVERS.map((_, i) => i + 1))
  })

  it('usa la escala sprint para carreras sprint', async () => {
    const saved = await fixture.service.saveClassification(SPRINT.id, classificationBody(DRIVERS))
    expect(saved.results.slice(0, 9).map((r) => r.points)).toEqual([8, 7, 6, 5, 4, 3, 2, 1, 0])
  })

  it('guarda la escudería actual del piloto e incrementa versión y revisión', async () => {
    const body = classificationBody(DRIVERS.slice(0, 1))
    const saved = await fixture.service.saveClassification(RACE.id, body)
    expect(saved.results[0]?.teamId).toBe(DRIVERS[0]?.teamId)
    expect(saved.race).toMatchObject({ version: 2, resultsRevision: 1, winnerName: 'Piloto 1' })
  })

  it('una corrección reemplaza la clasificación y suma otra revisión', async () => {
    await fixture.service.saveClassification(RACE.id, classificationBody(DRIVERS))
    const body = classificationBody(DRIVERS.slice(0, 3), 2)
    const fixed = await fixture.service.saveClassification(RACE.id, body)
    expect(fixed.results).toHaveLength(3)
    expect(fixed.race.resultsRevision).toBe(2)
  })

  it('lista las carreras de una temporada y obtiene una clasificación vacía', async () => {
    expect((await fixture.service.listSeason(2025)).map((r) => r.id)).toContain(RACE.id)
    expect(await fixture.service.listSeason(1990)).toEqual([])
    expect((await fixture.service.getClassification(RACE.id)).results).toEqual([])
  })
})
