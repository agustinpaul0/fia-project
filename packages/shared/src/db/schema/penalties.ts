import { index, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
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
    ...versionedColumns(),
  },
  (table) => [
    index('penalties_team_id_idx').on(table.teamId),
    index('penalties_driver_id_idx').on(table.driverId),
    index('penalties_race_id_idx').on(table.raceId),
    index('penalties_issued_at_idx').on(table.issuedAt),
    ...versionedChecks('penalties', table),
  ],
)

export type PenaltyRow = typeof penalties.$inferSelect
export type NewPenaltyRow = typeof penalties.$inferInsert
