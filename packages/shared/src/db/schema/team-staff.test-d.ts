import { describe, expectTypeOf, it } from 'vitest'
import type { TeamStaff } from '../../contracts'
import type { NewTeamStaffRow, TeamStaffRow } from './team-staff'

describe('tabla team_staff ⇔ contratos', () => {
  it('los campos canónicos del DTO coinciden con la fila de la tabla', () => {
    expectTypeOf<TeamStaff['id']>().toEqualTypeOf<TeamStaffRow['id']>()
    expectTypeOf<TeamStaff['teamId']>().toEqualTypeOf<TeamStaffRow['teamId']>()
    expectTypeOf<TeamStaff['userId']>().toEqualTypeOf<TeamStaffRow['userId']>()
    expectTypeOf<TeamStaff['fileNumber']>().toEqualTypeOf<TeamStaffRow['fileNumber']>()
    expectTypeOf<TeamStaff['isActive']>().toEqualTypeOf<TeamStaffRow['isActive']>()
    expectTypeOf<TeamStaff['version']>().toEqualTypeOf<TeamStaffRow['version']>()
  })

  it('NewTeamStaffRow exige los campos obligatorios de la tabla', () => {
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('userId')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('teamId')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('firstName')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('lastName')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('roleInTeam')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('phoneNumber')
    expectTypeOf<NewTeamStaffRow>().toHaveProperty('fileNumber')
  })
})
