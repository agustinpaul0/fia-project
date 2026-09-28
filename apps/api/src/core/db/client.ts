import { type Schema, schema } from '@fia/shared/db'
import { drizzle, type NodePgDatabase } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'

export type Database = NodePgDatabase<Schema>

export type DatabaseConnection = {
  readonly db: Database
  readonly close: () => Promise<void>
}

export const connectDatabase = (url: string): DatabaseConnection => {
  const pool = new Pool({ connectionString: url })
  return { db: drizzle(pool, { schema, casing: 'snake_case' }), close: () => pool.end() }
}

export type DatabaseTransaction = Parameters<Parameters<Database['transaction']>[0]>[0]

export type TransactionalDatabase = Database | DatabaseTransaction
