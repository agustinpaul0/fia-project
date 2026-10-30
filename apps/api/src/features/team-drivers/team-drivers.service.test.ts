import type { CreateTeamDriverBody } from '@fia/shared/contracts'
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

const mockBody: CreateTeamDriverBody = {
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  role: 'main',
}

const createRepo = (overrides: Partial<TeamDriversRepository> = {}): TeamDriversRepository => ({
  listAll: vi.fn().mockResolvedValue([mockRow]),
  listByTeam: vi.fn().mockResolvedValue([mockRow]),
  findById: vi.fn().mockResolvedValue(mockRow),
  findByNumber: vi.fn().mockResolvedValue(null),
  findByCode: vi.fn().mockResolvedValue(null),
  countByTeamAndRole: vi.fn().mockResolvedValue(0),
  create: vi.fn().mockResolvedValue(mockRow),
  update: vi.fn().mockResolvedValue(mockRow),
  ...overrides,
})

describe('TeamDriversService', () => {
  it('exige pertenencia a escudería en listMine y enroll', async () => {
    const service = createTeamDriversService(createRepo())
    const userWithoutTeam = { ...mockUser, teamId: null }
    await expect(service.listMine(userWithoutTeam)).rejects.toMatchObject({ code: 'TEAM_REQUIRED' })
    await expect(service.enroll(userWithoutTeam, mockBody)).rejects.toMatchObject({
      code: 'TEAM_REQUIRED',
    })
  })
  it('lista los pilotos de la escudería y el listado público', async () => {
    const repo = createRepo()
    const service = createTeamDriversService(repo)
    const result = await service.listMine(mockUser)
    expect(repo.listByTeam).toHaveBeenCalledWith('team-ferrari')
    expect(result[0]?.code).toBe('LEC')
    expect(await service.listPublic()).toHaveLength(1)
  })
  it('rechaza inscripción si el número ya existe', async () => {
    const service = createTeamDriversService(
      createRepo({ findByNumber: vi.fn().mockResolvedValue(mockRow) }),
    )
    await expect(service.enroll(mockUser, mockBody)).rejects.toMatchObject({
      code: 'CAR_NUMBER_ALREADY_TAKEN',
    })
  })
  it('rechaza inscripción si el código ya existe', async () => {
    const service = createTeamDriversService(
      createRepo({ findByCode: vi.fn().mockResolvedValue(mockRow) }),
    )
    await expect(service.enroll(mockUser, mockBody)).rejects.toMatchObject({
      code: 'DRIVER_CODE_ALREADY_TAKEN',
    })
  })

  it('rechaza inscripción si se supera el cupo de pilotos por rol', async () => {
    const repo = createRepo({ countByTeamAndRole: vi.fn().mockResolvedValue(2) })
    const service = createTeamDriversService(repo)
    await expect(service.enroll(mockUser, mockBody)).rejects.toMatchObject({
      code: 'DRIVER_LIMIT_EXCEEDED',
    })
  })

  it('inscribe piloto correctamente cuando los datos son válidos', async () => {
    const repo = createRepo()
    const service = createTeamDriversService(repo)
    const result = await service.enroll(mockUser, mockBody)
    expect(repo.create).toHaveBeenCalledWith('team-ferrari', mockBody)
    expect(result.id).toBe(mockRow.id)
    expect(result.code).toBe('LEC')
  })
})
