import { raceResults, races, scoreNotifications, seasons, teams, user } from '@fia/shared/db'
import { and, desc, eq, isNull, type SQL, sum } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { NotificationRecord } from './notifications.port'

const selectNotifications = (db: DbExecutor, where: SQL | undefined) => {
  const teamPoints = db
    .select({
      raceId: raceResults.raceId,
      teamId: raceResults.teamId,
      total: sum(raceResults.points).as('total'),
    })
    .from(raceResults)
    .groupBy(raceResults.raceId, raceResults.teamId)
    .as('team_points')
  return db
    .select({
      id: scoreNotifications.id,
      raceId: races.id,
      raceName: races.name,
      raceType: races.type,
      raceDate: races.date,
      seasonYear: seasons.year,
      resultsRevision: scoreNotifications.resultsRevision,
      latestRevision: races.resultsRevision,
      teamId: teams.id,
      teamName: teams.name,
      total: teamPoints.total,
      confirmedAt: scoreNotifications.confirmedAt,
      confirmedByName: user.name,
      createdAt: scoreNotifications.createdAt,
    })
    .from(scoreNotifications)
    .innerJoin(races, eq(races.id, scoreNotifications.raceId))
    .innerJoin(seasons, eq(seasons.id, races.seasonId))
    .innerJoin(teams, eq(teams.id, scoreNotifications.teamId))
    .leftJoin(user, eq(user.id, scoreNotifications.confirmedByUserId))
    .leftJoin(
      teamPoints,
      and(eq(teamPoints.raceId, races.id), eq(teamPoints.teamId, scoreNotifications.teamId)),
    )
    .where(where)
    .orderBy(desc(races.date), teams.name)
}

type Row = Awaited<ReturnType<typeof selectNotifications>>[number]

const toRecord = ({ total, ...row }: Row): NotificationRecord => ({
  ...row,
  teamPoints: Number(total ?? 0),
})

const isLatest = eq(scoreNotifications.resultsRevision, races.resultsRevision)

export const createNotificationsReader = (db: DbExecutor) => ({
  listPendingForTeam: async (teamId: string): Promise<readonly NotificationRecord[]> => {
    const pending = and(
      isLatest,
      eq(scoreNotifications.teamId, teamId),
      isNull(scoreNotifications.confirmedAt),
    )
    return (await selectNotifications(db, pending)).map(toRecord)
  },
  listLatest: async (): Promise<readonly NotificationRecord[]> =>
    (await selectNotifications(db, isLatest)).map(toRecord),
  findById: async (id: string): Promise<NotificationRecord | null> => {
    const [row] = await selectNotifications(db, eq(scoreNotifications.id, id))
    return row === undefined ? null : toRecord(row)
  },
})
