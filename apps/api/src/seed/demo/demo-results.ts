import type { RaceSummary, TeamStaff } from '@fia/shared/contracts'
import type { NotificationsService } from '../../features/notifications/notifications.service'
import type { RaceResultsService } from '../../features/race-results/race-results.service'

export const DEMO_CATEGORY = 'F1'
export const PUBLISHED_RACES = 2

export const racesToPublish = (races: readonly RaceSummary[]): readonly RaceSummary[] => {
  const published = races.filter((race) => race.resultsRevision > 0)
  if (published.length >= PUBLISHED_RACES) {
    return []
  }
  const pending = races.filter((race) => race.resultsRevision === 0 && race.winnerName !== null)
  return pending.slice(-(PUBLISHED_RACES - published.length))
}

export const publishDemoResults = async (
  service: RaceResultsService,
  season: number,
): Promise<readonly RaceSummary[]> => {
  const races = await service.listSeason({ season, category: DEMO_CATEGORY })
  const chosen = racesToPublish(races)
  for (const race of chosen) {
    const { results } = await service.getClassification(race.id)
    const entries = results.map((result) => ({ driverId: result.driverId }))
    await service.saveClassification(race.id, { version: race.version, entries })
  }
  return chosen
}

export const confirmDemoNotification = async (
  service: NotificationsService,
  member: TeamStaff,
): Promise<boolean> => {
  const audit = await service.audit()
  if (audit.some((item) => item.status === 'confirmed')) {
    return false
  }
  const user = { id: member.userId, role: 'team_staff' as const, teamId: member.teamId }
  const [first] = await service.listMine(user)
  if (first === undefined) {
    return false
  }
  await service.confirm(user, first.id)
  return true
}
