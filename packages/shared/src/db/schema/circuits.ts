import { sql } from 'drizzle-orm'
import { check, numeric, pgTable, unique, varchar } from 'drizzle-orm/pg-core'
import { idColumn, versionedChecks, versionedColumns } from './columns'

export const circuits = pgTable(
  'circuits',
  {
    id: idColumn(),
    name: varchar('name', { length: 100 }).notNull(),
    country: varchar('country', { length: 60 }).notNull(),
    city: varchar('city', { length: 60 }).notNull(),
    lengthKm: numeric('length_km', { precision: 5, scale: 3 }).notNull(),
    ...versionedColumns(),
  },
  (table) => [
    unique('circuits_name_unique').on(table.name),
    check('circuits_length_positive', sql`${table.lengthKm} > 0`),
    ...versionedChecks('circuits', table),
  ],
)

export type CircuitRow = typeof circuits.$inferSelect
export type NewCircuitRow = typeof circuits.$inferInsert
