import type { UpdateTeamDriverBody } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'
import { describe, expect, it, vi } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import type { TeamDriversRepository } from './team-drivers.port'
import { createTeamDriversService } from './team-drivers.service'

const mockUser: SessionUser = { id: 'user-1', role: 'team_staff', teamId: 'team-ferrari' }

const mockRow: DriverRow = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  categoryId: null,
  teamId: 'team-ferrari',
  role: 'main',
  version: 1,
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
}

const updateBody: UpdateTeamDriverBody = {
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  role: 'reserve',
  version: 1,
}

const createRepo = (overrides: Partial<TeamDriversRepository> = {}): TeamDriversRepository => ({
  listAll: vi.fn().mockResolvedValue([mockRow]),
  listByTeam: vi.fn().mockResolvedValue([mockRow]),
  findById: vi.fn().mockResolvedValue(mockRow),
  findByNumber: vi.fn().mockResolvedValue(null),
  findByCode: vi.fn().mockResolvedValue(null),
  countByTeamAndRole: vi.fn().mockResolvedValue(0),
  create: vi.fn().mockResolvedValue(mockRow),
  update: vi.fn().mockResolvedValue({ ...mockRow, role: 'reserve', version: 2 }),
  ...overrides,
})

describe('TeamDriversService.update (US-11)', () => {
  it('rechaza si el piloto no existe o pertenece a otra escudería', async () => {
    const notFound = createTeamDriversService(
      createRepo({ findById: vi.fn().mockResolvedValue(null) }),
    )
    await expect(
      notFound.update({ user: mockUser, id: mockRow.id, body: updateBody }),
    ).rejects.toMatchObject({ code: 'DRIVER_NOT_FOUND' })
    const other = createTeamDriversService(
      createRepo({ findById: vi.fn().mockResolvedValue({ ...mockRow, teamId: 'team-mclaren' }) }),
    )
    await expect(
      other.update({ user: mockUser, id: mockRow.id, body: updateBody }),
    ).rejects.toMatchObject({ code: 'FORBIDDEN' })
  })

  it('rechaza dorsal repetido, código repetido o cupo superado al cambiar rol', async () => {
    const dupNum = createTeamDriversService(
      createRepo({ findByNumber: vi.fn().mockResolvedValue(mockRow) }),
    )
    await expect(
      dupNum.update({ user: mockUser, id: mockRow.id, body: { ...updateBody, number: 55 } }),
    ).rejects.toMatchObject({ code: 'CAR_NUMBER_ALREADY_TAKEN' })
    const dupCode = createTeamDriversService(
      createRepo({ findByCode: vi.fn().mockResolvedValue(mockRow) }),
    )
    await expect(
      dupCode.update({ user: mockUser, id: mockRow.id, body: { ...updateBody, code: 'SAI' } }),
    ).rejects.toMatchObject({ code: 'DRIVER_CODE_ALREADY_TAKEN' })
    const full = createTeamDriversService(
      createRepo({ countByTeamAndRole: vi.fn().mockResolvedValue(2) }),
    )
    await expect(
      full.update({ user: mockUser, id: mockRow.id, body: updateBody }),
    ).rejects.toMatchObject({ code: 'DRIVER_LIMIT_EXCEEDED' })
  })

  it('actualiza el piloto e incrementa versión o lanza STALE_VERSION', async () => {
    const svc = createTeamDriversService(createRepo())
    const updated = await svc.update({ user: mockUser, id: mockRow.id, body: updateBody })
    expect(updated.role).toBe('reserve')
    expect(updated.version).toBe(2)
    const stale = createTeamDriversService(createRepo({ update: vi.fn().mockResolvedValue(null) }))
    await expect(
      stale.update({ user: mockUser, id: mockRow.id, body: updateBody }),
    ).rejects.toMatchObject({ code: 'STALE_VERSION' })
  })
})
