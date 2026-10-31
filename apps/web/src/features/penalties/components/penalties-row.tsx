import type { Penalty } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'
import { PenaltyTypeBadge } from './penalty-type-badge'

const NotificationCell = ({
  penalty,
  onConfirm,
}: {
  readonly penalty: Penalty
  readonly onConfirm?: ((id: string) => void) | undefined
}): ReactNode => {
  if (!penalty.notificationStatus) {
    return null
  }
  const confirmed = penalty.notificationStatus === 'confirmed'
  return (
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <span
          className={`inline-block border px-2 py-0.5 font-bold font-mono text-[11px] uppercase ${
            confirmed
              ? 'border-green-700 bg-green-100 text-green-900'
              : 'border-amber-600 bg-amber-100 text-amber-900'
          }`}
        >
          {confirmed ? 'Notificada' : 'Pendiente'}
        </span>
        {confirmed && penalty.confirmedByName && penalty.confirmedAt ? (
          <span className="font-mono text-[11px] text-on-surface-variant">
            {`${penalty.confirmedByName} · ${formatDateTime(penalty.confirmedAt)}`}
          </span>
        ) : null}
        {!confirmed && onConfirm ? (
          <button
            type="button"
            onClick={() => onConfirm(penalty.id)}
            className="border border-black bg-primary-container px-2 py-0.5 font-bold font-mono text-[11px] uppercase hover:brightness-95"
          >
            Confirmar
          </button>
        ) : null}
      </div>
    </td>
  )
}

export const PenaltiesRow = ({
  penalty,
  onConfirm,
}: {
  readonly penalty: Penalty
  readonly onConfirm?: ((id: string) => void) | undefined
}): ReactNode => (
  <tr className="border-b border-outline hover:bg-surface-container-low transition-colors">
    <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
      <div>{formatDateTime(penalty.issuedAt)}</div>
      {penalty.raceName && (
        <div className="text-[11px] font-sans font-bold text-primary">{penalty.raceName}</div>
      )}
    </td>
    <td className="px-4 py-3 font-bold font-mono text-xs">{penalty.categoryCode}</td>
    <td className="px-4 py-3">
      {penalty.driverName ? (
        <div>
          <span className="font-bold font-headline text-sm text-on-surface">
            {penalty.driverName}
          </span>
          <span className="ml-2 font-mono text-xs text-on-surface-variant">
            ({penalty.teamName})
          </span>
        </div>
      ) : (
        <span className="font-bold font-headline text-sm text-on-surface">
          {penalty.teamName} (Escudería)
        </span>
      )}
    </td>
    <td className="px-4 py-3">
      <PenaltyTypeBadge type={penalty.type} />
    </td>
    <td className="px-4 py-3 font-bold font-headline text-sm text-secondary">{penalty.penalty}</td>
    <td className="px-4 py-3 text-xs text-on-surface-variant max-w-xs">{penalty.reason}</td>
    <NotificationCell penalty={penalty} onConfirm={onConfirm} />
  </tr>
)
