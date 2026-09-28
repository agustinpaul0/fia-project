import { describe, expect, it } from 'vitest'
import { teamStaffListSchema, teamStaffSchema } from './team-staff'

const VALID_DTO = {
  id: '00000000-0000-4000-8000-000000000010',
  userId: 'user-123',
  teamId: '00000000-0000-4000-8000-000000000001',
  teamName: 'Ferrari',
  firstName: 'Carlos',
  lastName: 'Sainz',
  email: 'carlos@ferrari.com',
  roleInTeam: 'Director Deportivo',
  phoneNumber: '+54 9 291 7654321',
  fileNumber: 'LEG-1234',
  isActive: true,
  deactivatedAt: null,
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('contratos de respuesta DTO de personal', () => {
  it('valida DTO completo activo e inactivo', () => {
    expect(teamStaffSchema.parse(VALID_DTO)).toEqual(VALID_DTO)
    const inactiveDto = {
      ...VALID_DTO,
      isActive: false,
      deactivatedAt: '2026-02-01T00:00:00.000Z',
    }
    expect(teamStaffSchema.parse(inactiveDto)).toEqual(inactiveDto)
    expect(teamStaffListSchema.parse([VALID_DTO, inactiveDto])).toEqual([VALID_DTO, inactiveDto])
  })

  it.each([
    'id',
    'userId',
    'teamId',
    'teamName',
    'firstName',
    'lastName',
    'email',
    'roleInTeam',
    'phoneNumber',
    'fileNumber',
    'isActive',
    'deactivatedAt',
    'version',
    'createdAt',
    'updatedAt',
  ])('exige el campo %s en el DTO', (field) => {
    expect(teamStaffSchema.safeParse({ ...VALID_DTO, [field]: undefined }).success).toBe(false)
  })

  it('rechaza campos sensibles en el DTO', () => {
    expect(teamStaffSchema.safeParse({ ...VALID_DTO, passwordHash: 'hash' }).success).toBe(false)
    expect(teamStaffSchema.safeParse({ ...VALID_DTO, bannedReason: 'motivo' }).success).toBe(false)
  })
})
