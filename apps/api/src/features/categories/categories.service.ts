import type { Category, CreateCategoryBody, UpdateCategoryBody } from '@fia/shared/contracts'
import type { CategoryRow } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { toCategory } from './categories.mapper'
import type { CategoriesRepository } from './categories.port'

export type CategoriesService = {
  readonly list: () => Promise<readonly Category[]>
  readonly get: (id: string) => Promise<Category>
  readonly create: (body: CreateCategoryBody) => Promise<Category>
  readonly update: (id: string, body: UpdateCategoryBody) => Promise<Category>
  readonly remove: (id: string, version: number) => Promise<void>
}

const findOrFail = async (repository: CategoriesRepository, id: string): Promise<CategoryRow> => {
  const row = await repository.findById(id)
  if (row === null) {
    throw new AppError('CATEGORY_NOT_FOUND')
  }
  return row
}

export const createCategoriesService = (repository: CategoriesRepository): CategoriesService => ({
  list: async () => (await repository.findAll()).map(toCategory),
  get: async (id) => toCategory(await findOrFail(repository, id)),
  create: async (body) => toCategory(await repository.create(body)),
  update: async (id, body) => {
    await findOrFail(repository, id)
    const updated = await repository.update(id, body)
    if (updated === null) {
      throw new AppError('STALE_VERSION')
    }
    return toCategory(updated)
  },
  remove: async (id, version) => {
    await findOrFail(repository, id)
    if (!(await repository.remove(id, version))) {
      throw new AppError('STALE_VERSION')
    }
  },
})
