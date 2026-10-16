import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { PenaltiesRepository } from './penalties.port'
import { createPenaltiesService } from './penalties.service'

const mockPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000010',
  teamId: '00000000-0000-4000-8000-000000000001',
  teamName: 'Ferrari',
  driverId: '00000000-0000-4000-8000-000000000002',
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción en curva 1.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

const validBody: CreatePenaltyBody = {
  teamId: '00000000-0000-4000-8000-000000000001',
  driverId: '00000000-0000-4000-8000-000000000002',
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción en curva 1.',
}

const mockRepo = (overrides: Partial<PenaltiesRepository> = {}): PenaltiesRepository => ({
  list: vi.fn().mockResolvedValue([mockPenalty]),
  create: vi.fn().mockResolvedValue(mockPenalty),
  driverBelongsToTeam: vi.fn().mockResolvedValue(true),
  ...overrides,
})

describe('PenaltiesService', () => {
  it('lista sólo las sanciones de los últimos 5 años, con los filtros pedidos', async () => {
    const repo = mockRepo()
    const service = createPenaltiesService(repo, () => new Date('2026-10-16T12:00:00.000Z'))
    const result = await service.list({ season: 2026 })
    expect(repo.list).toHaveBeenCalledWith({
      season: 2026,
      issuedSince: new Date('2021-10-16T12:00:00.000Z'),
    })
    expect(result).toHaveLength(1)
  })

  it('permite crear sanción si el piloto pertenece a la escudería', async () => {
    const repo = mockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(true) })
    const service = createPenaltiesService(repo)
    const result = await service.create(validBody)
    expect(repo.create).toHaveBeenCalledWith(validBody)
    expect(result.id).toBe(mockPenalty.id)
  })

  it('permite crear sanción a nivel escudería sin piloto', async () => {
    const repo = mockRepo()
    const service = createPenaltiesService(repo)
    await service.create({ ...validBody, driverId: null })
    expect(repo.driverBelongsToTeam).not.toHaveBeenCalled()
    expect(repo.create).toHaveBeenCalled()
  })

  it('rechaza con INVALID_PENALTY_TARGET si el piloto no pertenece a la escudería', async () => {
    const repo = mockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(false) })
    const service = createPenaltiesService(repo)
    await expect(service.create(validBody)).rejects.toMatchObject({
      code: 'INVALID_PENALTY_TARGET',
    })
  })
})
