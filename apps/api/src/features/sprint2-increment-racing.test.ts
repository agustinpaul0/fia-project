import { API_PATHS, penaltyListSchema, technicalControlListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { sendJson } from '../testing/http'
import { FIA_ADMIN } from '../testing/session-users'
import {
  INCREMENT_DRIVER,
  INCREMENT_STAFF,
  INCREMENT_TEAM,
  sharedIncrementApp,
} from '../testing/sprint2-increment-app'

describe('Incremento de producto Sprint 2 (US-2): pilotos, controles y sanciones', () => {
  it('la escudería inscribe un piloto y la FIA lo controla y lo sanciona; el público lo ve', async () => {
    const as = sharedIncrementApp()
    const enroll = {
      firstName: 'Oliver',
      lastName: 'Bearman',
      code: 'BEA',
      number: 87,
      country: 'Reino Unido',
      license: 'FIA-87-BEA',
      role: 'reserve',
    }
    expect(
      (
        await sendJson(as(INCREMENT_STAFF), {
          method: 'POST',
          path: API_PATHS.teamDrivers,
          body: enroll,
        })
      ).status,
    ).toBe(201)
    const pilots = (await (
      await as(FIA_ADMIN).request(`/teams/${INCREMENT_TEAM.id}/drivers`)
    ).json()) as unknown[]
    expect(pilots).toHaveLength(2)
    const control = {
      teamId: INCREMENT_TEAM.id,
      carNumber: 16,
      controlType: 'weight',
      status: 'rejected',
      inspectedAt: '2026-10-16T12:00:00.000Z',
      expiresAt: '2099-10-23T12:00:00.000Z',
    }
    expect(
      (
        await sendJson(as(FIA_ADMIN), {
          method: 'POST',
          path: API_PATHS.technicalControls,
          body: control,
        })
      ).status,
    ).toBe(201)
    const penalty = {
      teamId: INCREMENT_TEAM.id,
      driverId: INCREMENT_DRIVER.id,
      type: 'disqualification',
      penalty: 'Descalificación',
      reason: 'Peso por debajo del mínimo.',
    }
    expect(
      (await sendJson(as(FIA_ADMIN), { method: 'POST', path: API_PATHS.penalties, body: penalty }))
        .status,
    ).toBe(201)
    expect(
      (
        await sendJson(as(INCREMENT_STAFF), {
          method: 'POST',
          path: API_PATHS.penalties,
          body: penalty,
        })
      ).status,
    ).toBe(403)
    const publicPenalties = penaltyListSchema.parse(
      await (await as(null).request(API_PATHS.penalties)).json(),
    )
    expect(publicPenalties.map((p) => p.driverId)).toEqual([INCREMENT_DRIVER.id])
    const publicControls = technicalControlListSchema.parse(
      await (await as(null).request(API_PATHS.technicalControls)).json(),
    )
    expect(publicControls.map((c) => c.carNumber)).toEqual([16])
  })
})
