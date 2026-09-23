import { sql } from 'drizzle-orm'
import { check, integer, pgTable, timestamp, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { categories } from './categories'
import { circuits } from './circuits'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { seasons } from './seasons'

export const races = pgTable(
  'races',
  {
    id: idColumn(),
    seasonId: uuid('season_id')
      .notNull()
      .references(() => seasons.id, { onDelete: 'restrict' }),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    circuitId: uuid('circuit_id')
      .notNull()
      .references(() => circuits.id, { onDelete: 'restrict' }),
    round: integer('round').notNull(),
    name: varchar('name', { length: 100 }).notNull(),
    date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
    ...versionedColumns(),
  },
  (table) => [
    unique('races_season_category_round_unique').on(table.seasonId, table.categoryId, table.round),
    check('races_round_positive', sql`${table.round} >= 1`),
    ...versionedChecks('races', table),
  ],
)

export type RaceRow = typeof races.$inferSelect
export type NewRaceRow = typeof races.$inferInsert
