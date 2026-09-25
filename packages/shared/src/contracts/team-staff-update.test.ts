import { describe, expect, it } from 'vitest'
import { updateTeamStaffBodySchema } from './team-staff'

const VALID_UPDATE = {
  firstName: 'Carlos',
  lastName: 'Sainz',
  teamId: '00000000-0000-4000-8000-000000000001',
  roleInTeam: 'Director Deportivo',
  phoneNumber: '+54 9 291 7654321',
  version: 1,
}

describe('contratos de edición de personal de escudería', () => {
  it('acepta un cuerpo de edición válido y recorta espacios', () => {
    const input = {
      ...VALID_UPDATE,
      firstName: ' Carlos ',
      lastName: ' Sainz ',
      roleInTeam: ' Director Deportivo ',
      phoneNumber: ' +54 9 291 7654321 ',
    }
    expect(updateTeamStaffBodySchema.parse(input)).toEqual(VALID_UPDATE)
  })

  it('exige versión positiva y rechaza campos inmutables como email o legajo', () => {
    expect(updateTeamStaffBodySchema.safeParse({ ...VALID_UPDATE, version: 0 }).success).toBe(false)
    expect(updateTeamStaffBodySchema.safeParse({ ...VALID_UPDATE, email: 'x@x.com' }).success).toBe(
      false,
    )
    expect(
      updateTeamStaffBodySchema.safeParse({ ...VALID_UPDATE, fileNumber: 'L-1' }).success,
    ).toBe(false)
    expect(updateTeamStaffBodySchema.safeParse({ ...VALID_UPDATE, extra: 1 }).success).toBe(false)
  })
})
