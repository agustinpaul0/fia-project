import { sql } from 'drizzle-orm'
import { check, integer, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { races } from './races'
import { teams } from './teams'

export const scoreNotifications = pgTable(
  'score_notifications',
  {
    id: idColumn(),
    raceId: uuid('race_id')
      .notNull()
      .references(() => races.id, { onDelete: 'cascade' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    resultsRevision: integer('results_revision').notNull(),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true, mode: 'date' }),
    confirmedByUserId: text('confirmed_by_user_id').references(() => user.id, {
      onDelete: 'restrict',
    }),
    ...versionedColumns(),
  },
  (table) => [
    unique('score_notifications_race_team_revision_unique').on(
      table.raceId,
      table.teamId,
      table.resultsRevision,
    ),
    check('score_notifications_revision_positive', sql`${table.resultsRevision} >= 1`),
    check(
      'score_notifications_confirmation_complete',
      sql`(${table.confirmedAt} is null) = (${table.confirmedByUserId} is null)`,
    ),
    ...versionedChecks('score_notifications', table),
  ],
)

export type ScoreNotificationRow = typeof scoreNotifications.$inferSelect
