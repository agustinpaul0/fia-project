import { categoryListSchema, categorySchema } from '@fia/shared/contracts'
import { beforeEach, describe, expect, it } from 'vitest'
import { aCategoryRow } from '../../testing/category-builders'
import { readError } from '../../testing/http'
import { createTestApp, type TestApp } from '../../testing/test-app'

const EXISTING = aCategoryRow()

describe('GET /categories (público)', () => {
  let testApp: TestApp

  beforeEach(() => {
    testApp = createTestApp({ categories: [EXISTING] })
  })

  it('responde 200 con una lista que cumple el contrato', async () => {
    const response = await testApp.app.request('/categories')
    expect(response.status).toBe(200)
    expect(categoryListSchema.parse(await response.json())).toHaveLength(1)
  })

  it('responde 200 con el detalle que cumple el contrato', async () => {
    const response = await testApp.app.request(`/categories/${EXISTING.id}`)
    expect(response.status).toBe(200)
    expect(categorySchema.parse(await response.json()).id).toBe(EXISTING.id)
  })

  it('responde 400 con el campo marcado si el id no es un UUID', async () => {
    const response = await testApp.app.request('/categories/no-es-uuid')
    expect(response.status).toBe(400)
    expect((await readError(response)).fields).toHaveProperty('id')
  })

  it('responde 404 CATEGORY_NOT_FOUND si no existe', async () => {
    const response = await testApp.app.request('/categories/00000000-0000-4000-8000-00000000ffff')
    expect(response.status).toBe(404)
    expect((await readError(response)).code).toBe('CATEGORY_NOT_FOUND')
  })
})
