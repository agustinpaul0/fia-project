import { sql } from 'drizzle-orm'
import { check, integer, pgTable, unique, uuid, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { teams } from './teams'

export const drivers = pgTable(
  'drivers',
  {
    id: idColumn(),
    firstName: varchar('first_name', { length: 60 }).notNull(),
    lastName: varchar('last_name', { length: 60 }).notNull(),
    code: varchar('code', { length: 3 }).notNull(),
    number: integer('number').notNull(),
    country: varchar('country', { length: 60 }).notNull(),
    teamId: uuid('team_id').references(() => teams.id, { onDelete: 'set null' }),
    role: varchar('role', { length: 20 }).notNull().default('main'),
    ...versionedColumns(),
  },
  (table) => [
    unique('drivers_code_unique').on(table.code),
    unique('drivers_number_unique').on(table.number),
    check('drivers_code_format', sql`${table.code} ~ '^[A-Z]{3}$'`),
    check('drivers_number_range', sql`${table.number} >= 1 and ${table.number} <= 99`),
    check('drivers_role_valid', sql`${table.role} in ('main', 'reserve')`),
    ...versionedChecks('drivers', table),
  ],
)

export type DriverRow = typeof drivers.$inferSelect
export type NewDriverRow = typeof drivers.$inferInsert
