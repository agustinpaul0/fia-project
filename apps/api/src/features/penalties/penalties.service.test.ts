import type { CreatePenaltyBody, Penalty } from '@fia/shared/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { PenaltiesRepository } from './penalties.port'
import { createPenaltiesService } from './penalties.service'

const TEAM_ID = '00000000-0000-4000-8000-000000000001'

const mockPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000010',
  teamId: TEAM_ID,
  teamName: 'Ferrari',
  categoryCode: 'F1',
  driverId: '00000000-0000-4000-8000-000000000002',
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción en curva 1.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  confirmedAt: null,
  confirmedByName: null,
  notificationStatus: 'pending',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

const validBody: CreatePenaltyBody = {
  teamId: TEAM_ID,
  driverId: '00000000-0000-4000-8000-000000000002',
  type: 'time_penalty',
  penalty: '5s recargo',
  reason: 'Infracción en curva 1.',
}

const mockRepo = (overrides: Partial<PenaltiesRepository> = {}): PenaltiesRepository => ({
  list: vi.fn().mockResolvedValue([mockPenalty]),
  findById: vi.fn().mockResolvedValue(mockPenalty),
  create: vi.fn().mockResolvedValue(mockPenalty),
  confirm: vi.fn().mockResolvedValue({
    ...mockPenalty,
    confirmedAt: '2026-05-24T15:00:00.000Z',
    confirmedByName: 'staff-1',
    notificationStatus: 'confirmed',
  }),
  driverBelongsToTeam: vi.fn().mockResolvedValue(true),
  ...overrides,
})

describe('PenaltiesService', () => {
  it('lista sanciones de los últimos 5 años y oculta notificación al público', async () => {
    const repo = mockRepo()
    const service = createPenaltiesService(repo, () => new Date('2026-10-16T12:00:00.000Z'))
    const anonResult = await service.list({ season: 2026 }, null)
    expect(anonResult[0]?.notificationStatus).toBeNull()
    const staffResult = await service.list(
      { season: 2026 },
      { role: 'team_staff', teamId: TEAM_ID },
    )
    expect(staffResult[0]?.notificationStatus).toBe('pending')
  })

  it('permite confirmar notificación una sola vez a la escudería sancionada', async () => {
    const repo = mockRepo()
    const service = createPenaltiesService(repo)
    const confirmed = await service.confirm(mockPenalty.id, { id: 'staff-1', teamId: TEAM_ID })
    expect(confirmed.notificationStatus).toBe('confirmed')

    const repoAlready = mockRepo({
      findById: vi.fn().mockResolvedValue({ ...mockPenalty, confirmedAt: '2026-05-24T15:00:00Z' }),
    })
    const svc2 = createPenaltiesService(repoAlready)
    await expect(
      svc2.confirm(mockPenalty.id, { id: 'staff-2', teamId: TEAM_ID }),
    ).rejects.toMatchObject({ code: 'NOTIFICATION_ALREADY_CONFIRMED' })
  })

  it('rechaza confirmar sanción de otra escudería o piloto ajeno al crear', async () => {
    const repo = mockRepo({ driverBelongsToTeam: vi.fn().mockResolvedValue(false) })
    const service = createPenaltiesService(repo)
    await expect(
      service.confirm(mockPenalty.id, { id: 'staff-other', teamId: 'other-team' }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
    await expect(service.create(validBody)).rejects.toMatchObject({
      code: 'INVALID_PENALTY_TARGET',
    })
  })
})
