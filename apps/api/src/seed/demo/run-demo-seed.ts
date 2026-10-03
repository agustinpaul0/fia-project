import { createProductionDependencies } from '../../app/production-dependencies'
import { createBetterAuth } from '../../core/auth/better-auth'
import { connectDatabase } from '../../core/db/client'
import { consoleLogger } from '../../core/logger'
import { loadEnv } from '../../env'
import { createNotificationsService } from '../../features/notifications/notifications.service'
import { createRaceResultsService } from '../../features/race-results/race-results.service'
import { createTeamStaffService } from '../../features/team-staff/team-staff.service'
import { createDrizzleTeamsRepository } from '../../features/teams/teams.repository'
import { seedAdminUser } from '../auth.seed'
import { seedBaseData } from '../base-data.seed'
import { seedCategories } from '../categories.seed'
import { seedDemoCategories } from './demo-categories.seed'
import { confirmDemoNotification, publishDemoResults } from './demo-results'
import { DEMO_STAFF, seedDemoStaff } from './demo-staff'

const env = loadEnv(process.env)
const connection = connectDatabase(env.DATABASE_URL)
const deps = createProductionDependencies({ env, db: connection.db, logger: consoleLogger })
const clock = (): Date => new Date()
const teams = createDrizzleTeamsRepository(connection.db)

await seedCategories(connection.db)
await seedBaseData(connection.db)
const extraCategories = await seedDemoCategories(connection.db)
const auth = createBetterAuth({
  db: connection.db,
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [env.WEB_ORIGIN],
})
await seedAdminUser(connection.db, auth, env)

const { teamStaffUow, raceResults, notifications } = deps.repositories
if (teamStaffUow === undefined || raceResults === undefined || notifications === undefined) {
  throw new Error('Faltan repositorios para cargar los datos de la demo')
}
const staff = await seedDemoStaff({
  service: createTeamStaffService({ uow: teamStaffUow, teams }),
  teams: await teams.findAllOptions(),
  password: env.DEMO_STAFF_PASSWORD,
})
const season = clock().getFullYear() - 1
const published = await publishDemoResults(
  createRaceResultsService({ repository: raceResults, clock }),
  season,
)
const mclaren = staff.find((member) => member.email === DEMO_STAFF[1]?.email)
const confirmed =
  mclaren !== undefined &&
  (await confirmDemoNotification(
    createNotificationsService({ repository: notifications, clock }),
    mclaren,
  ))

await connection.close()
consoleLogger.info('Datos de la demo listos', {
  admin: env.FIA_ADMIN_EMAIL,
  categoriasConResultados: ['F1', ...extraCategories],
  cuentasDeEscuderia: staff.map((member) => `${member.email} (${member.teamName})`),
  contraseñaDeEscuderias: 'la de DEMO_STAFF_PASSWORD en .env',
  carrerasPublicadas: published.map((race) => race.name),
  confirmacionDeEjemplo: confirmed ? 'McLaren confirmó una notificación' : 'ya existía',
})
