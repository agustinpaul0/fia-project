import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { sendJson } from '../../testing/http'
import { aRaceHeader, someDrivers } from '../../testing/race-builders'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const RACE = aRaceHeader()
const { app } = createTestApp({ races: [RACE], drivers: someDrivers(5), sessionUser: FIA_ADMIN })
const PATH = `/races/${RACE.id}/classification`

describe('Fuzz de clasificaciones', () => {
  it('PUT con payloads arbitrarios nunca responde 5xx y siempre con error tipado', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await sendJson(app, { method: 'PUT', path: PATH, body })
        expect(response.status).toBeLessThan(500)
        if (response.status !== 200) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })

  it('GET con temporadas arbitrarias nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (season) => {
        const response = await app.request(`/races?season=${encodeURIComponent(season)}`)
        expect(response.status).toBeLessThan(500)
      }),
    )
  })
})
