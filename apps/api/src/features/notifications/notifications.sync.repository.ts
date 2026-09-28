import { raceResults, races, scoreNotifications } from '@fia/shared/db'
import { and, eq, gt, isNull } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'

export const createNotificationsSync = (db: DbExecutor) => ({
  syncPending: async (teamId: string | null): Promise<void> => {
    const missing = and(
      gt(races.resultsRevision, 0),
      isNull(scoreNotifications.id),
      teamId === null ? undefined : eq(raceResults.teamId, teamId),
    )
    const pairs = await db
      .selectDistinct({
        raceId: raceResults.raceId,
        teamId: raceResults.teamId,
        resultsRevision: races.resultsRevision,
      })
      .from(raceResults)
      .innerJoin(races, eq(races.id, raceResults.raceId))
      .leftJoin(
        scoreNotifications,
        and(
          eq(scoreNotifications.raceId, raceResults.raceId),
          eq(scoreNotifications.teamId, raceResults.teamId),
          eq(scoreNotifications.resultsRevision, races.resultsRevision),
        ),
      )
      .where(missing)
    if (pairs.length > 0) {
      await db.insert(scoreNotifications).values(pairs).onConflictDoNothing()
    }
  },
})
