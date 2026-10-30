import { sql } from 'drizzle-orm'
import { check, index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { drivers } from './drivers'
import { races } from './races'
import { teams } from './teams'

export const penalties = pgTable(
  'penalties',
  {
    id: idColumn(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    driverId: uuid('driver_id').references(() => drivers.id, { onDelete: 'set null' }),
    raceId: uuid('race_id').references(() => races.id, { onDelete: 'set null' }),
    type: varchar('type', { length: 40 }).notNull(),
    penalty: varchar('penalty', { length: 100 }).notNull(),
    reason: text('reason').notNull(),
    issuedAt: timestamp('issued_at', { withTimezone: true, mode: 'date' }).notNull(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true, mode: 'date' }),
    confirmedByUserId: text('confirmed_by_user_id'),
    ...versionedColumns(),
  },
  (table) => [
    index('penalties_team_id_idx').on(table.teamId),
    index('penalties_driver_id_idx').on(table.driverId),
    index('penalties_race_id_idx').on(table.raceId),
    index('penalties_issued_at_idx').on(table.issuedAt),
    check(
      'penalties_type_valid',
      sql`${table.type} in ('time_penalty', 'grid_penalty', 'points_deduction', 'disqualification', 'fine', 'reprimand')`,
    ),
    check('penalties_penalty_length', sql`char_length(${table.penalty}) >= 2`),
    check('penalties_reason_length', sql`char_length(${table.reason}) between 5 and 255`),
    ...versionedChecks('penalties', table),
  ],
)

export type PenaltyRow = typeof penalties.$inferSelect
export type NewPenaltyRow = typeof penalties.$inferInsert
