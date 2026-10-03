import type { TeamOption, TeamStaff } from '@fia/shared/contracts'
import type { TeamStaffService } from '../../features/team-staff/team-staff.service'

export type DemoPerson = {
  readonly team: string
  readonly firstName: string
  readonly lastName: string
  readonly email: string
  readonly phoneNumber: string
  readonly fileNumber: string
}

export const DEMO_STAFF: readonly DemoPerson[] = [
  {
    team: 'Ferrari',
    firstName: 'Frédéric',
    lastName: 'Vasseur',
    email: 'vasseur@ferrari.demo',
    phoneNumber: '+39 0536 949111',
    fileNumber: 'FER-001',
  },
  {
    team: 'McLaren',
    firstName: 'Andrea',
    lastName: 'Stella',
    email: 'stella@mclaren.demo',
    phoneNumber: '+44 1483 261900',
    fileNumber: 'MCL-001',
  },
  {
    team: 'Mercedes',
    firstName: 'Toto',
    lastName: 'Wolff',
    email: 'wolff@mercedes.demo',
    phoneNumber: '+44 7700 900077',
    fileNumber: 'MER-001',
  },
  {
    team: 'Red Bull',
    firstName: 'Christian',
    lastName: 'Horner',
    email: 'horner@redbull.demo',
    phoneNumber: '+44 1908 279700',
    fileNumber: 'RBR-001',
  },
  {
    team: 'Aston Martin',
    firstName: 'Mike',
    lastName: 'Krack',
    email: 'krack@astonmartin.demo',
    phoneNumber: '+44 1327 850800',
    fileNumber: 'AMR-001',
  },
]

export const teamIdFor = (teams: readonly TeamOption[], team: string): string | null =>
  teams.find((option) => option.name.toLowerCase().includes(team.toLowerCase()))?.id ?? null

type SeedStaffInput = {
  readonly service: TeamStaffService
  readonly teams: readonly TeamOption[]
  readonly password: string
}

export const seedDemoStaff = async ({
  service,
  teams,
  password,
}: SeedStaffInput): Promise<readonly TeamStaff[]> => {
  const existing = await service.list()
  const result: TeamStaff[] = []
  for (const person of DEMO_STAFF) {
    const found = existing.find((member) => member.email === person.email)
    const teamId = teamIdFor(teams, person.team)
    if (found !== undefined) {
      result.push(found)
    } else if (teamId !== null) {
      const { team: _team, ...data } = person
      result.push(
        await service.create({ ...data, password, teamId, roleInTeam: 'Director de equipo' }),
      )
    }
  }
  return result
}
