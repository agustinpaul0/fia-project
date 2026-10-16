import { teams } from '@fia/shared/db'
import type { DbExecutor } from '../../core/db/executor'

export type TeamNameLookup = (teamId: string | null) => string | null

export const loadTeamNames = async (db: DbExecutor): Promise<TeamNameLookup> => {
  const rows = await db.select({ id: teams.id, name: teams.name }).from(teams)
  const byId = new Map(rows.map((t) => [t.id, t.name]))
  return (teamId) => (teamId === null ? null : (byId.get(teamId) ?? null))
}
