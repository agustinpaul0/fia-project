import type { Penalty } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'
import { PenaltyTypeBadge } from './penalty-type-badge'

export const PenaltiesRow = ({ penalty }: { readonly penalty: Penalty }): ReactNode => (
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
  </tr>
)
