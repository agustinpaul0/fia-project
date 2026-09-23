import type { Category } from '@fia/shared/contracts'
import type { CategoryRow } from '@fia/shared/db'

export const toCategory = (row: CategoryRow): Category => ({
  id: row.id,
  name: row.name,
  code: row.code,
  version: row.version,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})
