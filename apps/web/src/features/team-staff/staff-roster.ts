import type { TeamStaff } from '@fia/shared/contracts'

export type StaffFilter = {
  readonly text: string
  readonly teamId: string
}

export const EMPTY_FILTER: StaffFilter = { text: '', teamId: '' }

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

const matchesText = (member: TeamStaff, text: string): boolean => {
  const needle = normalize(text)
  const haystack = [
    `${member.firstName} ${member.lastName}`,
    member.email,
    member.teamName,
    member.fileNumber,
  ]
  return needle === '' || haystack.some((value) => normalize(value).includes(needle))
}

export const filterStaff = (
  members: readonly TeamStaff[],
  filter: StaffFilter,
): readonly TeamStaff[] =>
  members.filter(
    (member) =>
      matchesText(member, filter.text) && (filter.teamId === '' || member.teamId === filter.teamId),
  )

export type StaffStats = {
  readonly active: number
  readonly linkedTeams: number
}

export const staffStats = (members: readonly TeamStaff[]): StaffStats => {
  const active = members.filter((member) => member.isActive)
  return { active: active.length, linkedTeams: new Set(active.map((m) => m.teamId)).size }
}

export const initialsOf = (member: Pick<TeamStaff, 'firstName' | 'lastName'>): string =>
  `${member.firstName.trim().charAt(0)}${member.lastName.trim().charAt(0)}`.toUpperCase()
