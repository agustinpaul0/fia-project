import { sql } from 'drizzle-orm'
import { check, integer, type PgColumn, timestamp, uuid } from 'drizzle-orm/pg-core'

export const idColumn = () => uuid('id').primaryKey().defaultRandom()

const appClock = (): Date => new Date()

const timestampColumn = (name: string) =>
  timestamp(name, { withTimezone: true, mode: 'date' }).notNull().defaultNow().$defaultFn(appClock)

export const versionedColumns = () => ({
  version: integer('version').notNull().default(1),
  createdAt: timestampColumn('created_at'),
  updatedAt: timestampColumn('updated_at').$onUpdate(appClock),
})

type VersionedTableColumns = {
  readonly version: PgColumn
  readonly createdAt: PgColumn
  readonly updatedAt: PgColumn
}

export const versionedChecks = (tableName: string, table: VersionedTableColumns) => [
  check(`${tableName}_version_positive`, sql`${table.version} >= 1`),
  check(`${tableName}_updated_after_created`, sql`${table.updatedAt} >= ${table.createdAt}`),
]
