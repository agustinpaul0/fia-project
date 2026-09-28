import { categories, circuits, drivers, races, seasons } from '@fia/shared/db'
import { and, eq } from 'drizzle-orm'
import type { DbExecutor } from '../core/db/executor'
import { SEED_RACES, type SeedRaceDefinition } from './base-data-races-definitions'
import { type DriverSeedMap, seedRaceResults } from './base-data-results.seed'

interface RaceContext {
  categoryId: string
  seasonMap: Map<number, string>
  circuitMap: Map<string, string>
  driverMap: DriverSeedMap
}

const seedSingleRace = async (
  db: DbExecutor,
  def: SeedRaceDefinition,
  ctx: RaceContext,
): Promise<void> => {
  const seasonId = ctx.seasonMap.get(def.year)
  const circuitId = ctx.circuitMap.get(def.circuitName)
  if (!seasonId || !circuitId) {
    return
  }

  await db
    .insert(races)
    .values({
      seasonId,
      categoryId: ctx.categoryId,
      circuitId,
      round: def.round,
      type: def.type,
      name: def.name,
      date: new Date(def.date),
    })
    .onConflictDoNothing()

  const [race] = await db
    .select()
    .from(races)
    .where(
      and(
        eq(races.seasonId, seasonId),
        eq(races.categoryId, ctx.categoryId),
        eq(races.round, def.round),
        eq(races.type, def.type),
      ),
    )
    .limit(1)

  if (race) {
    await seedRaceResults({
      db,
      raceId: race.id,
      type: def.type,
      results: def.results,
      driverMap: ctx.driverMap,
    })
  }
}

export const seedRacesAndResults = async (db: DbExecutor): Promise<void> => {
  const [f1Category] = await db.select().from(categories).where(eq(categories.code, 'F1')).limit(1)
  if (!f1Category) {
    return
  }

  const allSeasons = await db.select().from(seasons)
  const allCircuits = await db.select().from(circuits)
  const allDrivers = await db.select().from(drivers)

  const ctx: RaceContext = {
    categoryId: f1Category.id,
    seasonMap: new Map(allSeasons.map((s) => [s.year, s.id])),
    circuitMap: new Map(allCircuits.map((c) => [c.name, c.id])),
    driverMap: new Map(allDrivers.map((d) => [d.code, { id: d.id, teamId: d.teamId }])),
  }

  for (const def of SEED_RACES) {
    await seedSingleRace(db, def, ctx)
  }
}
