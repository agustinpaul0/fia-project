import { beforeEach, describe, expect, it } from 'vitest'
import { aCategoryRow, anUpdateCategoryBody } from '../../testing/category-builders'
import { readError, sendJson } from '../../testing/http'
import { FIA_ADMIN } from '../../testing/session-users'
import { createTestApp, type TestApp } from '../../testing/test-app'

const EXISTING = aCategoryRow()
const PATH = `/categories/${EXISTING.id}`

describe('Concurrencia optimista en /categories/:id', () => {
  let testApp: TestApp

  beforeEach(() => {
    testApp = createTestApp({ sessionUser: FIA_ADMIN, categories: [EXISTING] })
  })

  it('el segundo PUT con la misma versión recibe 409 STALE_VERSION', async () => {
    const edit = { method: 'PUT', path: PATH, body: anUpdateCategoryBody() } as const
    expect((await sendJson(testApp.app, edit)).status).toBe(200)
    const stale = await sendJson(testApp.app, edit)
    expect(stale.status).toBe(409)
    expect((await readError(stale)).code).toBe('STALE_VERSION')
  })

  it('DELETE con versión vieja recibe 409 y no borra', async () => {
    const response = await sendJson(testApp.app, { method: 'DELETE', path: `${PATH}?version=5` })
    expect(response.status).toBe(409)
    expect(testApp.categories.rows.size).toBe(1)
  })

  it('DELETE con la versión vigente responde 204', async () => {
    const response = await sendJson(testApp.app, { method: 'DELETE', path: `${PATH}?version=1` })
    expect(response.status).toBe(204)
  })

  it('DELETE sin versión responde 400', async () => {
    const response = await sendJson(testApp.app, { method: 'DELETE', path: PATH })
    expect((await readError(response)).fields).toHaveProperty('version')
  })
})
