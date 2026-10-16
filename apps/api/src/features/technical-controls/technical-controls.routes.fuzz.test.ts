import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const { app } = createTestApp({ sessionUser: FIA_ADMIN })

describe('Fuzz de /technical-controls', () => {
  it('POST con payloads arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await sendJson(app, { method: 'POST', path: '/technical-controls', body })
        expect(response.status).toBeLessThan(500)
        if (response.status >= 400) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })

  it('GET con filtros arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.dictionary(fc.string(), fc.string()), async (query) => {
        const response = await app.request(`/technical-controls?${new URLSearchParams(query)}`)
        expect(response.status).toBeLessThan(500)
      }),
    )
  })
})
