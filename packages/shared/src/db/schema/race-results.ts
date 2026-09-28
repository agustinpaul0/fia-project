import { sql } from 'drizzle-orm'
import { check, integer, pgTable, unique, uuid } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { drivers } from './drivers'
import { races } from './races'
import { teams } from './teams'

export const raceResults = pgTable(
  'race_results',
  {
    id: idColumn(),
    raceId: uuid('race_id')
      .notNull()
      .references(() => races.id, { onDelete: 'cascade' }),
    driverId: uuid('driver_id')
      .notNull()
      .references(() => drivers.id, { onDelete: 'restrict' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    position: integer('position').notNull(),
    points: integer('points').notNull().default(0),
    ...versionedColumns(),
  },
  (table) => [
    unique('race_results_race_position_unique').on(table.raceId, table.position),
    unique('race_results_race_driver_unique').on(table.raceId, table.driverId),
    check('race_results_position_positive', sql`${table.position} >= 1`),
    check('race_results_points_non_negative', sql`${table.points} >= 0`),
    check('race_results_points_max', sql`${table.points} <= 25`),
    ...versionedChecks('race_results', table),
  ],
)

export type RaceResultRow = typeof raceResults.$inferSelect
export type NewRaceResultRow = typeof raceResults.$inferInsert
