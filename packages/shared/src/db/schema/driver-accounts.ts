import { sql } from 'drizzle-orm'
import { boolean, check, pgTable, text, timestamp, unique, uuid } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { idColumn, versionedChecks, versionedColumns } from './columns'
import { drivers } from './drivers'

export const driverAccounts = pgTable(
  'driver_accounts',
  {
    id: idColumn(),
    userId: text('user_id')
      .notNull()
      .references(() => user.id, { onDelete: 'restrict' }),
    driverId: uuid('driver_id')
      .notNull()
      .references(() => drivers.id, { onDelete: 'restrict' }),
    isActive: boolean('is_active').notNull().default(true),
    deactivatedAt: timestamp('deactivated_at', { withTimezone: true, mode: 'date' }),
    deactivatedBy: text('deactivated_by').references(() => user.id, { onDelete: 'restrict' }),
    ...versionedColumns(),
  },
  (table) => [
    unique('driver_accounts_user_id_unique').on(table.userId),
    unique('driver_accounts_driver_id_unique').on(table.driverId),
    check(
      'driver_accounts_deactivation_consistency',
      sql`(${table.isActive} = true and ${table.deactivatedAt} is null and ${table.deactivatedBy} is null) or (${table.isActive} = false and ${table.deactivatedAt} is not null and ${table.deactivatedBy} is not null)`,
    ),
    ...versionedChecks('driver_accounts', table),
  ],
)

export type DriverAccountRow = typeof driverAccounts.$inferSelect
export type NewDriverAccountRow = typeof driverAccounts.$inferInsert
