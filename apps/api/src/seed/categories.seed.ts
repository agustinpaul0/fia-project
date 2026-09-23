import type { CreateCategoryBody } from '@fia/shared/contracts'
import { categories } from '@fia/shared/db'
import type { DbExecutor } from '../core/db/executor'

export const SEED_CATEGORIES: readonly CreateCategoryBody[] = [
  { name: 'Fórmula 1', code: 'F1' },
  { name: 'Fórmula 2', code: 'F2' },
  { name: 'Fórmula 3', code: 'F3' },
  { name: 'F1 Academy', code: 'F1A' },
]

export const seedCategories = async (db: DbExecutor): Promise<void> => {
  await db
    .insert(categories)
    .values([...SEED_CATEGORIES])
    .onConflictDoNothing()
}
