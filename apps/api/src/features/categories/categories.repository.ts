import { categories } from '@fia/shared/db'
import { and, asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { firstOrThrow } from '../../core/db/first-or-throw'
import {
  type ConstraintErrorMap,
  translateConstraintViolations,
} from '../../core/errors/constraint-violations'
import type { CategoriesRepository } from './categories.port'

const CATEGORY_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  categories_name_unique: 'CATEGORY_ALREADY_EXISTS',
  categories_code_unique: 'CATEGORY_ALREADY_EXISTS',
  categories_name_min_length: 'VALIDATION_FAILED',
  categories_code_format: 'VALIDATION_FAILED',
}

const byIdAndVersion = (id: string, version: number) =>
  and(eq(categories.id, id), eq(categories.version, version))

export const createDrizzleCategoriesRepository = (db: DbExecutor): CategoriesRepository => ({
  findAll: () => db.select().from(categories).orderBy(asc(categories.name)),
  findById: async (id) => {
    const rows = await db.select().from(categories).where(eq(categories.id, id)).limit(1)
    return rows[0] ?? null
  },
  create: (input) =>
    translateConstraintViolations(CATEGORY_CONSTRAINT_ERRORS, async () =>
      firstOrThrow(await db.insert(categories).values(input).returning()),
    ),
  update: (id, { version, ...fields }) =>
    translateConstraintViolations(CATEGORY_CONSTRAINT_ERRORS, async () => {
      const rows = await db
        .update(categories)
        .set({ ...fields, version: version + 1 })
        .where(byIdAndVersion(id, version))
        .returning()
      return rows[0] ?? null
    }),
  remove: async (id, version) => {
    const rows = await db
      .delete(categories)
      .where(byIdAndVersion(id, version))
      .returning({ id: categories.id })
    return rows.length > 0
  },
})
