import type { NotificationStatus, ScoreNotification } from '@fia/shared/contracts'

export type AuditStatusFilter = NotificationStatus | 'all'

export type AuditFilter = {
  readonly text: string
  readonly status: AuditStatusFilter
}

export const ALL_AUDIT: AuditFilter = { text: '', status: 'all' }

const normalize = (value: string): string =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()

export const filterAudit = (
  list: readonly ScoreNotification[],
  filter: AuditFilter,
): readonly ScoreNotification[] => {
  const needle = normalize(filter.text)
  return list.filter(
    (item) =>
      (filter.status === 'all' || item.status === filter.status) &&
      (needle === '' || [item.raceName, item.teamName].some((v) => normalize(v).includes(needle))),
  )
}

export type AuditStats = {
  readonly total: number
  readonly confirmed: number
  readonly pending: number
  readonly confirmedPct: number
  readonly pendingPct: number
}

const pct = (part: number, total: number): number =>
  total === 0 ? 0 : Math.round((part / total) * 100)

export const auditStats = (list: readonly ScoreNotification[]): AuditStats => {
  const confirmed = list.filter((item) => item.status === 'confirmed').length
  const pending = list.length - confirmed
  return {
    total: list.length,
    confirmed,
    pending,
    confirmedPct: pct(confirmed, list.length),
    pendingPct: pct(pending, list.length),
  }
}
