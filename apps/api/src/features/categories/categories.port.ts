import type { CreateCategoryBody, UpdateCategoryBody } from '@fia/shared/contracts'
import type { CategoryRow } from '@fia/shared/db'

export type CategoriesRepository = {
  readonly findAll: () => Promise<readonly CategoryRow[]>
  readonly findById: (id: string) => Promise<CategoryRow | null>
  readonly create: (input: CreateCategoryBody) => Promise<CategoryRow>
  readonly update: (id: string, input: UpdateCategoryBody) => Promise<CategoryRow | null>
  readonly remove: (id: string, version: number) => Promise<boolean>
}
