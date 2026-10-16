import { drivers, teams } from '@fia/shared/db'
import { asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { TeamsRepository } from './teams.port'

export const createDrizzleTeamsRepository = (db: DbExecutor): TeamsRepository => ({
  findAllOptions: async () =>
    db.select({ id: teams.id, name: teams.name }).from(teams).orderBy(asc(teams.name)),
  exists: async (id) => {
    const rows = await db.select({ id: teams.id }).from(teams).where(eq(teams.id, id)).limit(1)
    return rows.length > 0
  },
  findDriverOptions: async (teamId) => {
    const rows = await db
      .select({ id: drivers.id, firstName: drivers.firstName, lastName: drivers.lastName })
      .from(drivers)
      .where(eq(drivers.teamId, teamId))
      .orderBy(asc(drivers.lastName))
    return rows.map((d) => ({ id: d.id, name: `${d.firstName} ${d.lastName}` }))
  },
})
