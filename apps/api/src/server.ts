import { configureSpanishValidation } from '@fia/shared/contracts'
import { serve } from '@hono/node-server'
import { createApp } from './app/create-app'
import { createProductionDependencies } from './app/production-dependencies'
import { connectDatabase } from './core/db/client'
import { consoleLogger } from './core/logger'
import { registerProcessGuards } from './core/process-guards'
import { loadEnv } from './env'

configureSpanishValidation()
registerProcessGuards(consoleLogger)

const env = loadEnv(process.env)
const connection = connectDatabase(env.DATABASE_URL)
const app = createApp(
  createProductionDependencies({ env, db: connection.db, logger: consoleLogger }),
)

const server = serve({ fetch: app.fetch, port: env.API_PORT }, (info) => {
  consoleLogger.info(`API escuchando en http://localhost:${info.port}`)
})

const shutdown = (): void => {
  server.close(() => {
    void connection.close()
  })
}

process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)
