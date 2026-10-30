import type { CreateTechnicalControlBody, TechnicalControl } from '@fia/shared/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { TechnicalControlsRepository } from './technical-controls.port'
import { createTechnicalControlsService } from './technical-controls.service'

const TEAM_ID = '22222222-2222-4222-8222-222222222222'
const DRIVER_ID = '33333333-3333-4333-8333-333333333333'

const mockControl: TechnicalControl = {
  id: '11111111-1111-4111-8111-111111111111',
  teamId: TEAM_ID,
  teamName: 'Ferrari',
  driverId: DRIVER_ID,
  driverName: 'Charles Leclerc',
  carNumber: 16,
  raceId: null,
  raceName: null,
  controlType: 'weight',
  status: 'rejected',
  notes: 'Peso por debajo del mínimo reglamentario.',
  inspectedAt: '2026-10-14T12:00:00.000Z',
  expiresAt: '2026-10-21T12:00:00.000Z',
  version: 1,
  createdAt: '2026-10-14T12:00:00.000Z',
}

const WHEN = {
  carNumber: 16,
  inspectedAt: '2026-10-14T12:00:00.000Z',
  expiresAt: '2026-10-21T12:00:00.000Z',
}

describe('TechnicalControlsService', () => {
  const createMockRepo = (
    overrides?: Partial<TechnicalControlsRepository>,
  ): TechnicalControlsRepository => ({
    list: vi.fn().mockResolvedValue([mockControl]),
    create: vi.fn().mockResolvedValue(mockControl),
    driverBelongsToTeam: vi.fn().mockResolvedValue(true),
    ...overrides,
  })

  it('lista controles vigentes y oculta observaciones al público anónimo', async () => {
    const repo = createMockRepo()
    const now = new Date('2026-10-16T12:00:00.000Z')
    const service = createTechnicalControlsService(repo, () => now)
    const anonResult = await service.list({ season: 2026 }, null)
    expect(anonResult[0]?.notes).toBeNull()
    const ownerResult = await service.list(
      { season: 2026 },
      { role: 'team_staff', teamId: TEAM_ID },
    )
    expect(ownerResult[0]?.notes).toBe(mockControl.notes)
  })

  it('lista controles propios en listByTeam y rechaza sin membresía', async () => {
    const repo = createMockRepo()
    const now = new Date('2026-10-16T12:00:00.000Z')
    const service = createTechnicalControlsService(repo, () => now)
    const own = await service.listByTeam(TEAM_ID, {})
    expect(own).toHaveLength(1)
    expect(repo.list).toHaveBeenCalledWith({ teamId: TEAM_ID, activeAt: now })
    await expect(service.listByTeam(null, {})).rejects.toMatchObject({
      code: 'TEAM_REQUIRED',
    })
  })

  it('crea control sin piloto o con piloto perteneciente a la escudería', async () => {
    const repo = createMockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(true) })
    const service = createTechnicalControlsService(repo)
    const body: CreateTechnicalControlBody = {
      teamId: TEAM_ID,
      driverId: DRIVER_ID,
      controlType: 'dimensions',
      status: 'passed',
      ...WHEN,
    }
    const result = await service.create(body)
    expect(result.id).toBe(mockControl.id)
  })

  it('rechaza control si el piloto no pertenece a la escudería', async () => {
    const repo = createMockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(false) })
    const service = createTechnicalControlsService(repo)
    const body: CreateTechnicalControlBody = {
      teamId: TEAM_ID,
      driverId: DRIVER_ID,
      controlType: 'engine',
      status: 'rejected',
      ...WHEN,
    }
    await expect(service.create(body)).rejects.toMatchObject({
      code: 'INVALID_TECHNICAL_CONTROL_TARGET',
    })
  })
})
