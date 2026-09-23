import { categorySchema } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import { aCategoryBody, aCategoryRow } from '../../testing/category-builders'
import { readError, sendJson } from '../../testing/http'
import { FIA_ADMIN, TEAM_STAFF } from '../../testing/session-users'
import { createTestApp } from '../../testing/test-app'

const createRequest = (body: unknown) => ({ method: 'POST', path: '/categories', body }) as const

describe('POST /categories', () => {
  it('responde 401 UNAUTHENTICATED sin sesión', async () => {
    const { app } = createTestApp()
    const response = await sendJson(app, createRequest(aCategoryBody()))
    expect(response.status).toBe(401)
    expect((await readError(response)).code).toBe('UNAUTHENTICATED')
  })

  it('responde 403 FORBIDDEN si el rol no es fia_admin', async () => {
    const { app } = createTestApp({ sessionUser: TEAM_STAFF })
    const response = await sendJson(app, createRequest(aCategoryBody()))
    expect(response.status).toBe(403)
  })

  it('responde 201 con la categoría creada según el contrato', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })
    const response = await sendJson(app, createRequest(aCategoryBody()))
    expect(response.status).toBe(201)
    expect(categorySchema.parse(await response.json())).toMatchObject({ code: 'F1', version: 1 })
  })

  it('responde 400 con mensajes por campo si los datos son inválidos', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })
    const response = await sendJson(app, createRequest({ name: 'X', code: 'f1' }))
    const error = await readError(response)
    expect(response.status).toBe(400)
    expect(Object.keys(error.fields ?? {})).toEqual(['name', 'code'])
  })

  it('responde 400 si se envían campos no permitidos', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })
    const response = await sendJson(app, createRequest({ ...aCategoryBody(), version: 9 }))
    expect((await readError(response)).fields).toHaveProperty('_form')
  })

  it('responde 409 CATEGORY_ALREADY_EXISTS si el código ya existe', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN, categories: [aCategoryRow()] })
    const response = await sendJson(app, createRequest(aCategoryBody({ name: 'Otra' })))
    expect(response.status).toBe(409)
    expect((await readError(response)).code).toBe('CATEGORY_ALREADY_EXISTS')
  })

  it('responde 400 si el JSON está mal formado', async () => {
    const { app } = createTestApp({ sessionUser: FIA_ADMIN })
    const response = await app.request('/categories', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: '{mal',
    })
    expect((await readError(response)).code).toBe('VALIDATION_FAILED')
  })
})
