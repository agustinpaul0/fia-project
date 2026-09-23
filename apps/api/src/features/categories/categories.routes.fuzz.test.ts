import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { aCategoryRow } from '../../testing/category-builders'
import { sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const { app } = createTestApp({ sessionUser: FIA_ADMIN, categories: [aCategoryRow()] })
const PATH = `/categories/${aCategoryRow().id}`

describe('Fuzz de /categories', () => {
  it('POST con payloads arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await sendJson(app, { method: 'POST', path: '/categories', body })
        expect(response.status).toBeLessThan(500)
      }),
    )
  })

  it('PUT con payloads arbitrarios responde 4xx con error tipado o 200', async () => {
    await fc.assert(
      fc.asyncProperty(fc.object(), async (body) => {
        const response = await sendJson(app, { method: 'PUT', path: PATH, body })
        if (response.status !== 200) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })

  it('GET con ids arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), async (id) => {
        const response = await app.request(`/categories/${encodeURIComponent(id)}`)
        expect(response.status).toBeLessThan(500)
      }),
    )
  })
})
