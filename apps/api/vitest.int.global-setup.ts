import { MIGRATIONS_FOLDER } from '@fia/shared/db'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { connectDatabase } from './src/core/db/client'
import { testDatabaseUrl } from './src/testing/integration/test-database-url'

export const setup = async (): Promise<void> => {
  const connection = connectDatabase(testDatabaseUrl())
  await migrate(connection.db, { migrationsFolder: MIGRATIONS_FOLDER })
  await connection.close()
}
