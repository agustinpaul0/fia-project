import { categories, circuits, drivers, seasons, teams } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from '../core/db/executor'
import { SEED_CIRCUITS, SEED_SEASONS } from './base-data-seasons-circuits'
import { SEED_DRIVERS, SEED_TEAMS } from './base-data-teams-drivers'

export const seedSeasonsAndCircuits = async (db: DbExecutor): Promise<void> => {
  await db
    .insert(seasons)
    .values([...SEED_SEASONS])
    .onConflictDoNothing()
  await db
    .insert(circuits)
    .values([...SEED_CIRCUITS])
    .onConflictDoNothing()
}

export const seedTeamsAndDrivers = async (db: DbExecutor): Promise<void> => {
  const [f1Category] = await db.select().from(categories).where(eq(categories.code, 'F1')).limit(1)
  if (!f1Category) {
    return
  }

  const teamValues = SEED_TEAMS.map((t) => ({
    name: t.name,
    country: t.country,
    categoryId: f1Category.id,
  }))
  await db.insert(teams).values(teamValues).onConflictDoNothing()

  const allTeams = await db.select().from(teams)
  const teamMap = new Map(allTeams.map((t) => [t.name, t.id]))

  const driverValues = SEED_DRIVERS.map((d) => ({
    firstName: d.firstName,
    lastName: d.lastName,
    code: d.code,
    number: d.number,
    country: d.country,
    teamId: teamMap.get(d.teamName) ?? null,
    role: 'main' as const,
  }))
  await db.insert(drivers).values(driverValues).onConflictDoNothing()
}
