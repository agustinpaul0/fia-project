import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { connectDatabase, type DatabaseConnection } from '../../core/db/client'
import { aCategoryBody } from '../../testing/category-builders'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleCategoriesRepository } from './categories.repository'

describe('DrizzleCategoriesRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('crea, lee y lista ordenado por nombre', () =>
    withRollback(connection, async (tx) => {
      const repository = createDrizzleCategoriesRepository(tx)
      const created = await repository.create(aCategoryBody())
      await repository.create(aCategoryBody({ name: 'F1 Academy', code: 'F1A' }))
      expect(await repository.findById(created.id)).toMatchObject({ version: 1 })
      expect((await repository.findAll()).map((row) => row.code)).toEqual(['F1A', 'F1'])
    }))

  it('traduce la restricción unique a CATEGORY_ALREADY_EXISTS', () =>
    withRollback(connection, async (tx) => {
      const repository = createDrizzleCategoriesRepository(tx)
      await repository.create(aCategoryBody())
      await expect(repository.create(aCategoryBody({ name: 'Otra' }))).rejects.toMatchObject({
        code: 'CATEGORY_ALREADY_EXISTS',
      })
    }))

  it('la restricción check rechaza códigos inválidos aunque no pasen por Zod', () =>
    withRollback(connection, async (tx) => {
      const repository = createDrizzleCategoriesRepository(tx)
      await expect(repository.create(aCategoryBody({ code: 'f-1' }))).rejects.toMatchObject({
        code: 'VALIDATION_FAILED',
      })
    }))

  it('actualiza sólo con la versión vigente y la incrementa', () =>
    withRollback(connection, async (tx) => {
      const repository = createDrizzleCategoriesRepository(tx)
      const { id } = await repository.create(aCategoryBody())
      const edit = { ...aCategoryBody({ name: 'F1 World' }), version: 1 }
      expect(await repository.update(id, edit)).toMatchObject({ version: 2 })
      expect(await repository.update(id, edit)).toBeNull()
    }))

  it('elimina sólo con la versión vigente', () =>
    withRollback(connection, async (tx) => {
      const repository = createDrizzleCategoriesRepository(tx)
      const { id } = await repository.create(aCategoryBody())
      expect(await repository.remove(id, 9)).toBe(false)
      expect(await repository.remove(id, 1)).toBe(true)
      expect(await repository.findById(id)).toBeNull()
    }))
})
