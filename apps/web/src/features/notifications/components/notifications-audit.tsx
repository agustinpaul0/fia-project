import type { ScoreNotification } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { QueryView } from '@/components/common/query-view'
import { ALL_AUDIT, auditStats, filterAudit } from '../audit-log'
import { useNotificationsAudit } from '../hooks/use-notifications'
import { AuditFilters } from './audit-filters'
import { AuditHero } from './audit-hero'
import { NotificationsAuditTable } from './notifications-audit-table'

export const NO_NOTIFICATIONS_MESSAGE = 'Todavía no se publicó ningún puntaje para notificar.'

const AuditLog = ({ list }: { readonly list: readonly ScoreNotification[] }): ReactNode => {
  const [filter, setFilter] = useState(ALL_AUDIT)
  const stats = auditStats(list)
  return (
    <>
      <AuditFilters filter={filter} stats={stats} onChange={setFilter} />
      <NotificationsAuditTable notifications={filterAudit(list, filter)} stats={stats} />
    </>
  )
}

export const NotificationsAudit = (): ReactNode => {
  const query = useNotificationsAudit()
  return (
    <section className="mx-auto flex w-full max-w-[1600px] flex-col gap-6 px-6 py-6 md:py-8">
      <AuditHero stats={query.data === undefined ? null : auditStats(query.data)} />
      <QueryView
        query={query}
        isEmpty={(list) => list.length === 0}
        emptyMessage={NO_NOTIFICATIONS_MESSAGE}
      >
        {(list) => <AuditLog list={list} />}
      </QueryView>
    </section>
  )
}
