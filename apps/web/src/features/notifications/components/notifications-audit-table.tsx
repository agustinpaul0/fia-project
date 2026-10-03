import type { ScoreNotification } from '@fia/shared/contracts'
import { Database } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AuditStats } from '../audit-log'
import { AuditRow } from './audit-row'

export const NO_AUDIT_MATCHES = 'No se encontraron confirmaciones que coincidan con la búsqueda.'

const HEADERS = ['Carrera', 'Escudería', 'Notificación'] as const

type Props = {
  readonly notifications: readonly ScoreNotification[]
  readonly stats: AuditStats
}

export const NotificationsAuditTable = ({ notifications, stats }: Props): ReactNode => (
  <div className="w-full overflow-hidden border-2 border-primary bg-surface-container-lowest shadow-[6px_6px_0px_0px_#1a1a1a]">
    <div className="flex items-center gap-2 bg-primary px-4 py-2 font-bold font-headline text-on-primary text-xs uppercase tracking-wider">
      <Database className="size-4 text-primary-container" aria-hidden />
      <span>Registro oficial de notificaciones de puntajes</span>
    </div>
    <div className="w-full overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-primary border-b-2 bg-primary font-headline text-on-primary text-xs uppercase tracking-wider">
            <th
              scope="col"
              className="w-12 border-surface-variant border-r-2 px-4 py-3 text-center font-bold"
            >
              #
            </th>
            {HEADERS.map((header) => (
              <th
                key={header}
                scope="col"
                className="border-surface-variant border-r-2 px-4 py-3 font-bold"
              >
                {header}
              </th>
            ))}
            <th
              scope="col"
              className="w-36 border-surface-variant border-r-2 px-4 py-3 text-center font-bold"
            >
              Estado
            </th>
            <th scope="col" className="px-4 py-3 font-bold">
              Confirmó
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-primary text-sm">
          {notifications.map((item, index) => (
            <AuditRow key={item.id} item={item} index={index} />
          ))}
        </tbody>
      </table>
    </div>
    {notifications.length === 0 ? (
      <p className="bg-surface-container p-10 text-center font-bold font-headline text-primary text-sm uppercase">
        {NO_AUDIT_MATCHES}
      </p>
    ) : null}
    <div className="flex flex-wrap items-center gap-2 border-primary border-t-2 bg-surface-container-high p-4 font-headline text-primary text-xs uppercase tracking-wider">
      <span className="bg-primary px-2 py-0.5 font-bold text-on-primary">
        Resumen de trazabilidad
      </span>
      <span className="font-semibold">
        Mostrando {notifications.length} de {stats.total} | {stats.confirmed} confirmadas (
        {stats.confirmedPct}%) | {stats.pending} pendientes ({stats.pendingPct}%)
      </span>
    </div>
  </div>
)
