import type { CreateTechnicalControlBody, TechnicalControl } from '@fia/shared/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { TechnicalControlsRepository } from './technical-controls.port'
import { createTechnicalControlsService } from './technical-controls.service'

const mockControl: TechnicalControl = {
  id: '11111111-1111-4111-8111-111111111111',
  teamId: '22222222-2222-4222-8222-222222222222',
  teamName: 'Ferrari',
  driverId: '33333333-3333-4333-8333-333333333333',
  driverName: 'Charles Leclerc',
  carNumber: 16,
  raceId: null,
  raceName: null,
  controlType: 'weight',
  status: 'passed',
  notes: null,
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

  it('lista sólo los controles vigentes al momento de la consulta', async () => {
    const repo = createMockRepo()
    const now = new Date('2026-10-16T12:00:00.000Z')
    const service = createTechnicalControlsService(repo, () => now)
    const result = await service.list({ season: 2026 })
    expect(result).toHaveLength(1)
    expect(repo.list).toHaveBeenCalledWith({ season: 2026, activeAt: now })
  })

  it('crea control sin piloto sin verificar pertenencia', async () => {
    const repo = createMockRepo()
    const service = createTechnicalControlsService(repo)
    const body: CreateTechnicalControlBody = {
      teamId: '22222222-2222-4222-8222-222222222222',
      controlType: 'fuel',
      status: 'passed',
      ...WHEN,
    }
    const result = await service.create(body)
    expect(result.id).toBe(mockControl.id)
    expect(repo.driverBelongsToTeam).not.toHaveBeenCalled()
  })

  it('crea control con piloto que pertenece a la escudería', async () => {
    const repo = createMockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(true) })
    const service = createTechnicalControlsService(repo)
    const body: CreateTechnicalControlBody = {
      teamId: '22222222-2222-4222-8222-222222222222',
      driverId: '33333333-3333-4333-8333-333333333333',
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
      teamId: '22222222-2222-4222-8222-222222222222',
      driverId: '33333333-3333-4333-8333-333333333333',
      controlType: 'engine',
      status: 'rejected',
      ...WHEN,
    }
    await expect(service.create(body)).rejects.toMatchObject({
      code: 'INVALID_TECHNICAL_CONTROL_TARGET',
    })
  })
})
