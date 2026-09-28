import type {
  NotificationRecord,
  NotificationsRepository,
} from '../features/notifications/notifications.port'

export type InMemoryNotifications = NotificationsRepository & {
  readonly records: Map<string, NotificationRecord>
  readonly syncedTeams: (string | null)[]
}

const isLatest = (record: NotificationRecord): boolean =>
  record.resultsRevision === record.latestRevision

export const createInMemoryNotifications = (
  seed: readonly NotificationRecord[] = [],
  userNames: Readonly<Record<string, string>> = {},
): InMemoryNotifications => {
  const records = new Map(seed.map((record) => [record.id, record]))
  const syncedTeams: (string | null)[] = []
  return {
    records,
    syncedTeams,
    syncPending: async (teamId) => {
      syncedTeams.push(teamId)
    },
    listPendingForTeam: async (teamId) =>
      [...records.values()].filter(
        (r) => r.teamId === teamId && r.confirmedAt === null && isLatest(r),
      ),
    listLatest: async () => [...records.values()].filter(isLatest),
    findById: async (id) => records.get(id) ?? null,
    confirm: async ({ id, userId, at }) => {
      const record = records.get(id)
      if (record === undefined || record.confirmedAt !== null) {
        return false
      }
      records.set(id, { ...record, confirmedAt: at, confirmedByName: userNames[userId] ?? userId })
      return true
    },
  }
}
