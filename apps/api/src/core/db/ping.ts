import { categories } from '@fia/shared/db'
import type { Database } from './client'

export type DatabasePing = () => Promise<boolean>

export const createDatabasePing =
  (db: Database): DatabasePing =>
  async () => {
    try {
      await db.select({ id: categories.id }).from(categories).limit(1)
      return true
    } catch {
      return false
    }
  }
