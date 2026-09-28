import { sql } from 'drizzle-orm'
import {
  check,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { RACE_TYPES } from '../../domain/scoring'
import { categories } from './categories'
import { circuits } from './circuits'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { seasons } from './seasons'

export const raceTypeEnum = pgEnum('race_type', RACE_TYPES)

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
    type: raceTypeEnum('type').notNull().default('grand_prix'),
    name: varchar('name', { length: 100 }).notNull(),
    date: timestamp('date', { withTimezone: true, mode: 'date' }).notNull(),
    resultsRevision: integer('results_revision').notNull().default(0),
    ...versionedColumns(),
  },
  (table) => [
    unique('races_season_category_round_type_unique').on(
      table.seasonId,
      table.categoryId,
      table.round,
      table.type,
    ),
    check('races_round_positive', sql`${table.round} >= 1`),
    check('races_results_revision_non_negative', sql`${table.resultsRevision} >= 0`),
    ...versionedChecks('races', table),
  ],
)

export type RaceRow = typeof races.$inferSelect
export type NewRaceRow = typeof races.$inferInsert
