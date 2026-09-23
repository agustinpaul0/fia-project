import type { CreateCategoryBody, UpdateCategoryBody } from '@fia/shared/contracts'
import type { CategoryRow } from '@fia/shared/db'

export const FIXED_DATE = new Date('2026-01-01T00:00:00.000Z')

export const aCategoryBody = (overrides: Partial<CreateCategoryBody> = {}): CreateCategoryBody => ({
  name: 'Fórmula 1',
  code: 'F1',
  ...overrides,
})

export const anUpdateCategoryBody = (
  overrides: Partial<UpdateCategoryBody> = {},
): UpdateCategoryBody => ({ ...aCategoryBody(), version: 1, ...overrides })

export const aCategoryRow = (overrides: Partial<CategoryRow> = {}): CategoryRow => ({
  id: '00000000-0000-4000-8000-000000000001',
  ...aCategoryBody(),
  version: 1,
  createdAt: FIXED_DATE,
  updatedAt: FIXED_DATE,
  ...overrides,
})
