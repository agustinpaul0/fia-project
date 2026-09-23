import { connectDatabase } from '../core/db/client'
import { consoleLogger } from '../core/logger'
import { loadEnv } from '../env'
import { seedCategories } from './categories.seed'

const connection = connectDatabase(loadEnv(process.env).DATABASE_URL)
await seedCategories(connection.db)
await connection.close()
consoleLogger.info('Datos de ejemplo cargados')
