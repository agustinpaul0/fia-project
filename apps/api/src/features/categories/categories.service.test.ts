import { beforeEach, describe, expect, it } from 'vitest'
import { aCategoryBody, aCategoryRow, anUpdateCategoryBody } from '../../testing/category-builders'
import {
  createInMemoryCategoriesRepository,
  type InMemoryCategoriesRepository,
} from '../../testing/in-memory-categories.repository'
import { type CategoriesService, createCategoriesService } from './categories.service'

const EXISTING = aCategoryRow()
const MISSING_ID = '00000000-0000-4000-8000-00000000ffff'

describe('CategoriesService', () => {
  let repository: InMemoryCategoriesRepository
  let service: CategoriesService

  beforeEach(() => {
    repository = createInMemoryCategoriesRepository([EXISTING])
    service = createCategoriesService(repository)
  })

  it('lista las categorías como DTOs con fechas ISO', async () => {
    expect(await service.list()).toEqual([
      expect.objectContaining({ id: EXISTING.id, createdAt: EXISTING.createdAt.toISOString() }),
    ])
  })

  it('obtiene una categoría existente', async () => {
    expect((await service.get(EXISTING.id)).code).toBe(EXISTING.code)
  })

  it('falla con CATEGORY_NOT_FOUND si no existe', async () => {
    await expect(service.get(MISSING_ID)).rejects.toMatchObject({ code: 'CATEGORY_NOT_FOUND' })
  })

  it('crea una categoría con versión 1', async () => {
    const created = await service.create(aCategoryBody({ name: 'Fórmula 2', code: 'F2' }))
    expect(created).toMatchObject({ name: 'Fórmula 2', version: 1 })
  })

  it('actualiza e incrementa la versión', async () => {
    const updated = await service.update(EXISTING.id, anUpdateCategoryBody({ name: 'F1 World' }))
    expect(updated).toMatchObject({ name: 'F1 World', version: 2 })
  })

  it('rechaza actualizar con una versión vieja', async () => {
    await service.update(EXISTING.id, anUpdateCategoryBody())
    await expect(service.update(EXISTING.id, anUpdateCategoryBody())).rejects.toMatchObject({
      code: 'STALE_VERSION',
    })
  })

  it('rechaza actualizar una categoría inexistente', async () => {
    await expect(service.update(MISSING_ID, anUpdateCategoryBody())).rejects.toMatchObject({
      code: 'CATEGORY_NOT_FOUND',
    })
  })

  it('elimina con la versión vigente', async () => {
    await service.remove(EXISTING.id, 1)
    expect(repository.rows.size).toBe(0)
  })

  it('rechaza eliminar con una versión vieja', async () => {
    await expect(service.remove(EXISTING.id, 7)).rejects.toMatchObject({ code: 'STALE_VERSION' })
  })

  it('rechaza eliminar una categoría inexistente', async () => {
    await expect(service.remove(MISSING_ID, 1)).rejects.toMatchObject({
      code: 'CATEGORY_NOT_FOUND',
    })
  })
})
