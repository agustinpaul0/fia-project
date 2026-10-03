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

export type SeedTeam = { readonly name: string; readonly country: string }

export type SeedDriver = {
  readonly firstName: string
  readonly lastName: string
  readonly code: string
  readonly number: number
  readonly country: string
  readonly teamName: string
}

export type CategoryRoster = {
  readonly categoryCode: string
  readonly teams: readonly SeedTeam[]
  readonly drivers: readonly SeedDriver[]
}

export const seedRoster = async (db: DbExecutor, roster: CategoryRoster): Promise<void> => {
  const [category] = await db
    .select()
    .from(categories)
    .where(eq(categories.code, roster.categoryCode))
    .limit(1)
  if (!category) {
    return
  }
  const teamValues = roster.teams.map((t) => ({ ...t, categoryId: category.id }))
  await db.insert(teams).values(teamValues).onConflictDoNothing()
  const teamMap = new Map((await db.select().from(teams)).map((t) => [t.name, t.id]))
  const driverValues = roster.drivers.map(({ teamName, ...d }) => ({
    ...d,
    teamId: teamMap.get(teamName) ?? null,
    role: 'main' as const,
  }))
  await db.insert(drivers).values(driverValues).onConflictDoNothing()
}

export const seedTeamsAndDrivers = (db: DbExecutor): Promise<void> =>
  seedRoster(db, { categoryCode: 'F1', teams: SEED_TEAMS, drivers: SEED_DRIVERS })
