import { categories, circuits, drivers, races, seasons, teams } from '@fia/shared/db'
import type { DatabaseTransaction } from '../../core/db/client'

export type RacingFixture = {
  readonly raceId: string
  readonly categoryId: string
  readonly driverIds: readonly string[]
  readonly teamId: string
}

const DRIVER_SEEDS = [
  { firstName: 'Lando', lastName: 'Norris', code: 'NOR', number: 4 },
  { firstName: 'Oscar', lastName: 'Piastri', code: 'PIA', number: 81 },
  { firstName: 'Max', lastName: 'Verstappen', code: 'VER', number: 1 },
] as const

export const seedRacingFixture = async (tx: DatabaseTransaction): Promise<RacingFixture> => {
  const [category] = await tx
    .insert(categories)
    .values({ name: 'Categoría Test', code: 'CT' })
    .returning({ id: categories.id })
  const [season] = await tx
    .insert(seasons)
    .values({ year: 2099, name: 'Temporada test' })
    .returning()
  const [circuit] = await tx
    .insert(circuits)
    .values({ name: 'Circuito test', country: 'Argentina', city: 'Bahía Blanca', lengthKm: '4.2' })
    .returning()
  if (category === undefined || season === undefined || circuit === undefined) {
    throw new Error('No se pudo armar el fixture de carreras')
  }
  const [team] = await tx
    .insert(teams)
    .values({ name: 'Escudería test', country: 'Argentina', categoryId: category.id })
    .returning()
  const teamId = team?.id ?? ''
  const created = await tx
    .insert(drivers)
    .values(DRIVER_SEEDS.map((d) => ({ ...d, country: 'Argentina', teamId })))
    .returning({ id: drivers.id })
  const [race] = await tx
    .insert(races)
    .values({
      seasonId: season.id,
      categoryId: category.id,
      circuitId: circuit.id,
      round: 1,
      name: 'Gran Premio test',
      date: new Date('2099-03-01T15:00:00.000Z'),
    })
    .returning({ id: races.id })
  return {
    raceId: race?.id ?? '',
    categoryId: category.id,
    driverIds: created.map((d) => d.id),
    teamId,
  }
}
