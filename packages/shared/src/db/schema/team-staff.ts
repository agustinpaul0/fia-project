import { sql } from 'drizzle-orm'
import {
  boolean,
  check,
  index,
  pgTable,
  text,
  timestamp,
  unique,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core'
import { user } from './auth'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { teams } from './teams'

export const teamStaff = pgTable(
  'team_staff',
  {
    id: idColumn(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    teamId: uuid('team_id')
      .notNull()
      .references(() => teams.id, { onDelete: 'restrict' }),
    firstName: varchar('first_name', { length: 60 }).notNull(),
    lastName: varchar('last_name', { length: 60 }).notNull(),
    roleInTeam: varchar('role_in_team', { length: 60 }).notNull(),
    phoneNumber: varchar('phone_number', { length: 30 }).notNull(),
    fileNumber: varchar('file_number', { length: 20 }).notNull(),
    isActive: boolean('is_active').notNull().default(true),
    deactivatedAt: timestamp('deactivated_at', { withTimezone: true, mode: 'date' }),
    deactivatedBy: text('deactivated_by').references(() => user.id, { onDelete: 'restrict' }),
    ...versionedColumns(),
  },
  (table) => [
    unique('team_staff_user_id_unique').on(table.userId),
    unique('team_staff_file_number_unique').on(table.fileNumber),
    index('team_staff_team_id_idx').on(table.teamId),
    index('team_staff_list_idx').on(table.isActive, table.lastName, table.firstName),
    check('team_staff_first_name_not_blank', sql`char_length(btrim(${table.firstName})) >= 1`),
    check('team_staff_last_name_not_blank', sql`char_length(btrim(${table.lastName})) >= 1`),
    check('team_staff_role_in_team_length', sql`char_length(btrim(${table.roleInTeam})) >= 2`),
    check('team_staff_phone_number_format', sql`${table.phoneNumber} ~ '^[0-9+() -]{7,30}$'`),
    check('team_staff_file_number_format', sql`${table.fileNumber} ~ '^[A-Z0-9-]{1,20}$'`),
    check(
      'team_staff_deactivation_consistency',
      sql`(${table.isActive} = true and ${table.deactivatedAt} is null and ${table.deactivatedBy} is null) or (${table.isActive} = false and ${table.deactivatedAt} is not null and ${table.deactivatedBy} is not null)`,
    ),
    ...versionedChecks('team_staff', table),
  ],
)

export type TeamStaffRow = typeof teamStaff.$inferSelect
export type NewTeamStaffRow = typeof teamStaff.$inferInsert
