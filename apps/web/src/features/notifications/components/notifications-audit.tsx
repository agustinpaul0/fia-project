import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useNotificationsAudit } from '../hooks/use-notifications'
import { NotificationsAuditTable } from './notifications-audit-table'

export const NO_NOTIFICATIONS_MESSAGE = 'Todavía no se publicó ningún puntaje para notificar.'

export const NotificationsAudit = (): ReactNode => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">Confirmaciones de puntajes</h2>
    <p className="text-sm text-muted-foreground">
      Quién confirmó cada puntaje publicado y cuándo (hora argentina).
    </p>
    <QueryView
      query={useNotificationsAudit()}
      isEmpty={(list) => list.length === 0}
      emptyMessage={NO_NOTIFICATIONS_MESSAGE}
    >
      {(list) => <NotificationsAuditTable notifications={list} />}
    </QueryView>
  </section>
)
