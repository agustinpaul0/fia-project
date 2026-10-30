import type { TechnicalControl } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'
import { TechnicalControlStatusBadge } from './technical-control-status-badge'
import { TechnicalControlTypeBadge } from './technical-control-type-badge'

export const TechnicalControlsRow = ({
  control,
}: {
  readonly control: TechnicalControl
}): ReactNode => {
  const isRejected = control.status === 'rejected'
  const rowClass = isRejected
    ? 'border-b border-outline border-l-4 border-l-secondary bg-red-50/70 transition-colors'
    : 'border-b border-outline hover:bg-surface-container-low transition-colors'

  return (
    <tr className={rowClass} data-rejected={isRejected ? 'true' : 'false'}>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
        <div>{formatDateTime(control.inspectedAt)}</div>
        {control.raceName && (
          <div className="text-[11px] font-sans font-bold text-primary">{control.raceName}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <div className="font-bold font-headline text-sm text-on-surface">
          {control.teamName}
          <span className="ml-2 font-mono text-xs text-primary font-bold">
            Auto #{control.carNumber}
          </span>
        </div>
        {control.driverName && (
          <div className="text-xs text-on-surface-variant">{control.driverName}</div>
        )}
      </td>
      <td className="px-4 py-3">
        <TechnicalControlTypeBadge type={control.controlType} />
      </td>
      <td className="px-4 py-3">
        <TechnicalControlStatusBadge status={control.status} />
      </td>
      <td className="px-4 py-3 font-mono text-xs text-on-surface-variant">
        {formatDateTime(control.expiresAt)}
      </td>
      <td className="px-4 py-3 text-xs max-w-xs">
        {control.notes ? (
          <span
            className={
              isRejected
                ? 'inline-block border border-secondary bg-red-100 px-2 py-1 font-bold text-red-900'
                : 'text-on-surface'
            }
          >
            {control.notes}
          </span>
        ) : (
          <span className="text-on-surface-variant">—</span>
        )}
      </td>
    </tr>
  )
}
