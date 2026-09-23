import { sql } from 'drizzle-orm'
import { check, pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'

export const categories = pgTable(
  'categories',
  {
    id: idColumn(),
    name: varchar('name', { length: 60 }).notNull(),
    code: varchar('code', { length: 10 }).notNull(),
    ...versionedColumns(),
  },
  (table) => [
    unique('categories_name_unique').on(table.name),
    unique('categories_code_unique').on(table.code),
    check('categories_name_min_length', sql`char_length(btrim(${table.name})) >= 2`),
    check('categories_code_format', sql`${table.code} ~ '^[A-Z0-9]{2,10}$'`),
    ...versionedChecks('categories', table),
  ],
)

export type CategoryRow = typeof categories.$inferSelect
export type NewCategoryRow = typeof categories.$inferInsert
