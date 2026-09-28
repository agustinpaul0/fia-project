import type { ScoreNotification } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { formatDateTime } from '@/lib/format-date-time'
import { revisionLabel } from './notification-card'

const Status = ({ notification }: { readonly notification: ScoreNotification }): ReactNode =>
  notification.status === 'confirmed' ? (
    <Badge variant="secondary">Confirmada</Badge>
  ) : (
    <Badge variant="destructive">Pendiente</Badge>
  )

export const NotificationsAuditTable = ({
  notifications,
}: {
  readonly notifications: readonly ScoreNotification[]
}): ReactNode => (
  <table className="w-full text-sm">
    <thead className="border-b text-left text-muted-foreground">
      <tr>
        <th className="py-2">Carrera</th>
        <th>Escudería</th>
        <th>Notificación</th>
        <th>Estado</th>
        <th>Confirmó</th>
      </tr>
    </thead>
    <tbody>
      {notifications.map((n) => (
        <tr key={n.id} className="border-b last:border-0">
          <td className="py-2">{n.raceName}</td>
          <td>{n.teamName}</td>
          <td>{revisionLabel(n.resultsRevision)}</td>
          <td>
            <Status notification={n} />
          </td>
          <td>
            {n.confirmedAt === null
              ? '—'
              : `${n.confirmedByName ?? ''} · ${formatDateTime(n.confirmedAt)}`}
          </td>
        </tr>
      ))}
    </tbody>
  </table>
)
