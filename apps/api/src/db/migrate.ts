import { MIGRATIONS_FOLDER } from '@fia/shared/db'
import { migrate } from 'drizzle-orm/node-postgres/migrator'
import { connectDatabase } from '../core/db/client'
import { consoleLogger } from '../core/logger'
import { loadEnv } from '../env'

const connection = connectDatabase(loadEnv(process.env).DATABASE_URL)
await migrate(connection.db, { migrationsFolder: MIGRATIONS_FOLDER })
await connection.close()
consoleLogger.info('Migraciones aplicadas')
