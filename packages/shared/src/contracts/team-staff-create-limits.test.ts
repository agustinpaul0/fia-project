import { describe, expect, it } from 'vitest'
import { createTeamStaffBodySchema } from './team-staff'

const VALID = {
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  password: 'Password123!',
  teamId: '00000000-0000-4000-8000-000000000001',
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
}

describe('contratos de alta de personal - valores límite', () => {
  it('acepta valores límite inferiores y superiores', () => {
    const atLowerLimits = {
      ...VALID,
      firstName: 'A',
      lastName: 'A'.repeat(60),
      roleInTeam: 'AB',
      phoneNumber: '1234567',
      fileNumber: 'A'.repeat(20),
    }
    expect(createTeamStaffBodySchema.safeParse(atLowerLimits).success).toBe(true)

    const atUpperLimits = {
      ...VALID,
      firstName: 'A'.repeat(60),
      lastName: 'B',
      roleInTeam: 'A'.repeat(60),
      phoneNumber: '1'.repeat(30),
      fileNumber: 'A',
    }
    expect(createTeamStaffBodySchema.safeParse(atUpperLimits).success).toBe(true)
  })
})
