import { index, integer, pgTable, text, timestamp, uuid, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { drivers } from './drivers'
import { races } from './races'
import { teams } from './teams'

export const technicalControls = pgTable(
  'technical_controls',
  {
    id: idColumn(),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'cascade' }),
    driverId: uuid('driver_id').references(() => drivers.id, { onDelete: 'set null' }),
    carNumber: integer('car_number'),
    raceId: uuid('race_id').references(() => races.id, { onDelete: 'set null' }),
    controlType: varchar('control_type', { length: 40 }).notNull(),
    status: varchar('status', { length: 20 }).notNull(),
    notes: text('notes'),
    inspectedAt: timestamp('inspected_at', { withTimezone: true, mode: 'date' }).notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'date' }),
    ...versionedColumns(),
  },
  (table) => [
    index('tech_controls_team_id_idx').on(table.teamId),
    index('tech_controls_driver_id_idx').on(table.driverId),
    index('tech_controls_race_id_idx').on(table.raceId),
    index('tech_controls_status_idx').on(table.status),
    index('tech_controls_inspected_at_idx').on(table.inspectedAt),
    ...versionedChecks('technical_controls', table),
  ],
)

export type TechnicalControlRow = typeof technicalControls.$inferSelect
export type NewTechnicalControlRow = typeof technicalControls.$inferInsert
