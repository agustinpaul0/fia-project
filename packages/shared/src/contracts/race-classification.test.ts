import { describe, expect, it } from 'vitest'
import { raceClassificationPath, racesOfSeasonPath } from './api-paths'
import { raceClassificationBodySchema, raceListQuerySchema } from './race-classification'

const driver = (n: number): { driverId: string } => ({
  driverId: `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`,
})

const firstMessage = (input: unknown): string | undefined =>
  raceClassificationBodySchema.safeParse(input).error?.issues[0]?.message

describe('contrato de carga de clasificación', () => {
  it('acepta pilotos en orden de llegada con la versión', () => {
    const body = { version: 1, entries: [driver(1), driver(2)] }
    expect(raceClassificationBodySchema.parse(body)).toEqual(body)
  })

  it.each([
    [{ version: 1, entries: [] }, 'La clasificación debe tener al menos un piloto.'],
    [
      { version: 1, entries: Array.from({ length: 31 }, (_, i) => driver(i + 1)) },
      'La clasificación no puede tener más de 30 pilotos.',
    ],
    [
      { version: 1, entries: [driver(1), driver(1)] },
      'Un piloto no puede aparecer dos veces en la clasificación.',
    ],
    [{ version: 1, entries: [{ driverId: 'x' }] }, 'El piloto elegido no es válido.'],
    [{ version: 0, entries: [driver(1)] }, 'La versión debe ser mayor que cero.'],
  ])('rechaza %o con un mensaje claro', (body, message) => {
    expect(firstMessage(body)).toBe(message)
  })

  it('rechaza campos extra en cada posición', () => {
    const body = { version: 1, entries: [{ ...driver(1), points: 25 }] }
    expect(raceClassificationBodySchema.safeParse(body).success).toBe(false)
  })

  it('acepta 30 pilotos', () => {
    const entries = Array.from({ length: 30 }, (_, i) => driver(i + 1))
    expect(raceClassificationBodySchema.safeParse({ version: 1, entries }).success).toBe(true)
  })
})

describe('query y rutas de carreras', () => {
  it('convierte la temporada a número y valida su rango', () => {
    expect(raceListQuerySchema.parse({ season: '2024' })).toEqual({ season: 2024 })
    expect(raceListQuerySchema.safeParse({ season: '1900' }).error?.issues[0]?.message).toBe(
      'La temporada no es válida.',
    )
    expect(raceListQuerySchema.safeParse({ season: '2101' }).success).toBe(false)
  })

  it('arma las rutas de la API', () => {
    expect(racesOfSeasonPath(2024)).toBe('/races?season=2024')
    expect(raceClassificationPath('abc')).toBe('/races/abc/classification')
  })
})
