import { createBetterAuth } from '../core/auth/better-auth'
import { connectDatabase } from '../core/db/client'
import { consoleLogger } from '../core/logger'
import { loadEnv } from '../env'
import { seedAdminUser } from './auth.seed'
import { seedCategories } from './categories.seed'

const env = loadEnv(process.env)
const connection = connectDatabase(env.DATABASE_URL)
const auth = createBetterAuth({
  db: connection.db,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_ORIGIN],
})
await seedCategories(connection.db)
await seedAdminUser(connection.db, auth, env)
await connection.close()
consoleLogger.info('Datos de ejemplo cargados')
