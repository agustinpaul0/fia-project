import { describe, expect, it, vi } from 'vitest'
import type { DbExecutor } from '../core/db/executor'
import { seedBaseData } from './base-data.seed'
import { seedSeasonsAndCircuits, seedTeamsAndDrivers } from './base-data-entities.seed'
import { seedRacesAndResults } from './base-data-races.seed'

describe('base-data seeds', () => {
  it('seedSeasonsAndCircuits ejecuta inserts con onConflictDoNothing', async () => {
    const onConflictDoNothing = vi.fn().mockResolvedValue({})
    const values = vi.fn().mockReturnValue({ onConflictDoNothing })
    const insert = vi.fn().mockReturnValue({ values })
    const db = { insert } as unknown as DbExecutor

    await seedSeasonsAndCircuits(db)
    expect(insert).toHaveBeenCalledTimes(2)
    expect(onConflictDoNothing).toHaveBeenCalledTimes(2)
  })

  it('seedTeamsAndDrivers se detiene tempranamente si no encuentra categoría F1', async () => {
    const select = vi.fn().mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
    })
    const insert = vi.fn()
    const db = { select, insert } as unknown as DbExecutor

    await seedTeamsAndDrivers(db)
    expect(insert).not.toHaveBeenCalled()
  })

  it('seedTeamsAndDrivers inserta equipos y pilotos cuando F1 existe', async () => {
    const onConflictDoNothing = vi.fn().mockResolvedValue({})
    const values = vi.fn().mockReturnValue({ onConflictDoNothing })
    const insert = vi.fn().mockReturnValue({ values })
    let callCount = 0
    const select = vi.fn().mockImplementation(() => ({
      from: () => {
        callCount++
        if (callCount === 1) {
          return { where: () => ({ limit: () => Promise.resolve([{ id: 'cat-f1' }]) }) }
        }
        return Promise.resolve([{ id: 'team-1', name: 'Red Bull Racing' }])
      },
    }))
    const db = { select, insert } as unknown as DbExecutor

    await seedTeamsAndDrivers(db)
    expect(insert).toHaveBeenCalledTimes(2)
  })

  it('seedRacesAndResults se detiene tempranamente si no encuentra categoría F1', async () => {
    const select = vi.fn().mockReturnValue({
      from: () => ({ where: () => ({ limit: () => Promise.resolve([]) }) }),
    })
    const insert = vi.fn()
    const db = { select, insert } as unknown as DbExecutor

    await seedRacesAndResults(db)
    expect(insert).not.toHaveBeenCalled()
  })

  it('seedBaseData invoca la carga completa', async () => {
    const onConflictDoNothing = vi.fn().mockResolvedValue({})
    const values = vi.fn().mockReturnValue({ onConflictDoNothing })
    const insert = vi.fn().mockReturnValue({ values })
    const select = vi.fn().mockReturnValue({
      from: () => ({
        where: () => ({ limit: () => Promise.resolve([]) }),
      }),
    })
    const db = { select, insert } as unknown as DbExecutor

    await seedBaseData(db)
    expect(insert).toHaveBeenCalled()
  })
})
