import type { CategoryRow } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import type { CategoriesRepository } from '../features/categories/categories.port'

export type InMemoryCategoriesRepository = CategoriesRepository & {
  readonly rows: Map<string, CategoryRow>
}

const assertUnique = (rows: Map<string, CategoryRow>, candidate: CategoryRow): void => {
  const clash = [...rows.values()].some(
    (row) =>
      row.id !== candidate.id && (row.name === candidate.name || row.code === candidate.code),
  )
  if (clash) {
    throw new AppError('CATEGORY_ALREADY_EXISTS')
  }
}

export const createInMemoryCategoriesRepository = (
  seed: readonly CategoryRow[] = [],
): InMemoryCategoriesRepository => {
  const rows = new Map(seed.map((row) => [row.id, row]))
  const save = (row: CategoryRow): CategoryRow => {
    assertUnique(rows, row)
    rows.set(row.id, row)
    return row
  }
  return {
    rows,
    findAll: async () => [...rows.values()].sort((a, b) => a.name.localeCompare(b.name)),
    findById: async (id) => rows.get(id) ?? null,
    create: async (input) => {
      const now = new Date()
      return save({ id: crypto.randomUUID(), ...input, version: 1, createdAt: now, updatedAt: now })
    },
    update: async (id, { version, ...fields }) => {
      const current = rows.get(id)
      if (current === undefined || current.version !== version) {
        return null
      }
      return save({ ...current, ...fields, version: version + 1, updatedAt: new Date() })
    },
    remove: async (id, version) => rows.get(id)?.version === version && rows.delete(id),
  }
}
