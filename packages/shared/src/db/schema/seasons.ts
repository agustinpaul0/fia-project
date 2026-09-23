import { sql } from 'drizzle-orm'
import { check, integer, pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'

export const seasons = pgTable(
  'seasons',
  {
    id: idColumn(),
    year: integer('year').notNull(),
    name: varchar('name', { length: 60 }).notNull(),
    ...versionedColumns(),
  },
  (table) => [
    unique('seasons_year_unique').on(table.year),
    check('seasons_year_range', sql`${table.year} >= 1950 and ${table.year} <= 2100`),
    ...versionedChecks('seasons', table),
  ],
)

export type SeasonRow = typeof seasons.$inferSelect
export type NewSeasonRow = typeof seasons.$inferInsert
