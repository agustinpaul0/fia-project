import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aClassification, anEligibleDriver, aRaceSummary, RACE_ID } from '@/testing/race-builders'
import { raceQueryKeys } from './race-query-keys'
import {
  fetchRaceClassification,
  fetchRaceDrivers,
  fetchSeasonRaces,
  saveRaceClassification,
} from './race-results-api'

describe('API de resultados de carreras', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('consulta las carreras de una temporada', async () => {
    mockFetchRoutes({ 'GET /races?season=2025': () => jsonResponse([aRaceSummary()]) })
    expect(await fetchSeasonRaces(2025)).toEqual([aRaceSummary()])
  })

  it('consulta la clasificación y los pilotos habilitados', async () => {
    mockFetchRoutes({
      [`GET /races/${RACE_ID}/classification`]: () => jsonResponse(aClassification()),
      [`GET /races/${RACE_ID}/drivers`]: () => jsonResponse([anEligibleDriver(1)]),
    })
    expect(await fetchRaceClassification(RACE_ID)).toEqual(aClassification())
    expect(await fetchRaceDrivers(RACE_ID)).toEqual([anEligibleDriver(1)])
  })

  it('guarda la clasificación con PUT y el cuerpo exacto', async () => {
    const calls = mockFetchRoutes({
      [`PUT /races/${RACE_ID}/classification`]: () => jsonResponse(aClassification()),
    })
    const body = { version: 3, entries: [{ driverId: anEligibleDriver(1).id }] }
    await saveRaceClassification({ raceId: RACE_ID, body })
    expect(calls).toEqual([{ key: `PUT /races/${RACE_ID}/classification`, body }])
  })

  it('arma claves de caché distintas por consulta', () => {
    expect(raceQueryKeys.season(2025)).toEqual(['races', 'season', 2025])
    expect(raceQueryKeys.classification('x')).toEqual(['races', 'x', 'classification'])
    expect(raceQueryKeys.drivers('x')).toEqual(['races', 'x', 'drivers'])
  })
})
