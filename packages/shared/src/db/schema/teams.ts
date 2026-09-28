import { pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { idColumn, versionedChecks, versionedColumns } from './columns'

export const teams = pgTable(
  'teams',
  {
    id: idColumn(),
    name: varchar('name', { length: 80 }).notNull(),
    country: varchar('country', { length: 60 }).notNull(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    ...versionedColumns(),
  },
  (table) => [unique('teams_name_unique').on(table.name), ...versionedChecks('teams', table)],
)

export type TeamRow = typeof teams.$inferSelect
export type NewTeamRow = typeof teams.$inferInsert
