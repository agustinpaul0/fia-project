import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { buildTeamStaffDto } from '../../testing/team-staff-builders'
import { createTestApp } from '../../testing/test-app'

const staffMember = buildTeamStaffDto()
const { app } = createTestApp({ sessionUser: FIA_ADMIN, staff: [staffMember] })
const PATH = `/team-staff/${staffMember.id}`

describe('Fuzz de /team-staff', () => {
  it('POST con payloads arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await sendJson(app, { method: 'POST', path: '/team-staff', body })
        expect(response.status).toBeLessThan(500)
        if (response.status >= 400) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })

  it('PUT con payloads arbitrarios responde < 500 con error tipado', async () => {
    await fc.assert(
      fc.asyncProperty(fc.object(), async (body) => {
        const response = await sendJson(app, { method: 'PUT', path: PATH, body })
        expect(response.status).toBeLessThan(500)
        if (response.status >= 400) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })

  it('DELETE con queries arbitrarias nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (query) => {
        const response = await app.request(`${PATH}?version=${encodeURIComponent(query)}`, {
          method: 'DELETE',
        })
        expect(response.status).toBeLessThan(500)
      }),
    )
  })
})
