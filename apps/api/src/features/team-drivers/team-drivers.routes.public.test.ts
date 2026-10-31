import { publicDriverListSchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { aDriverRow } from '../../testing/driver-row-builders'
import { sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const DRIVER = aDriverRow()
const STAFF = { id: 'staff-ferrari', role: 'team_staff', teamId: DRIVER.teamId } as const

describe('reflejo de cambios de pilotos ante la FIA y el público (US-11)', () => {
  it('un cambio de la escudería se ve en la siguiente consulta pública y de la FIA', async () => {
    const staff = createTestApp({ sessionUser: STAFF, teamDrivers: [DRIVER] })
    const { app: _staffApp, ...sharedRepositories } = staff
    const body = {
      firstName: DRIVER.firstName,
      lastName: DRIVER.lastName,
      code: DRIVER.code,
      number: DRIVER.number,
      country: DRIVER.country,
      license: DRIVER.license,
      role: 'reserve',
      version: 1,
    }
    const put = await sendJson(staff.app, {
      method: 'PUT',
      path: `/team-drivers/${DRIVER.id}`,
      body,
    })
    expect(put.status).toBe(200)
    for (const viewer of [null, FIA_ADMIN]) {
      const { app } = createTestApp({ sessionUser: viewer, sharedRepositories })
      const list = publicDriverListSchema.parse(
        await (await app.request('/team-drivers/public')).json(),
      )
      expect(list[0]).toMatchObject({ role: 'reserve', version: 2 })
    }
    expect(sharedRepositories.teamDrivers.items[0]?.updatedByUserId).toBe(STAFF.id)
  })
})
