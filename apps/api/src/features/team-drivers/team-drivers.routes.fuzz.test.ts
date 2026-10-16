import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { sendJson } from '../../testing/http'
import { TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const { app } = createTestApp({ sessionUser: TEAM_STAFF })

describe('Fuzz de /team-drivers', () => {
  it('POST con payloads arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await sendJson(app, { method: 'POST', path: '/team-drivers', body })
        expect(response.status).toBeLessThan(500)
        if (response.status >= 400) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })
})
