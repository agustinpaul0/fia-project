import type { ScoreNotification } from '@fia/shared/contracts'
import { cn } from 'cn'
import { Check, Clock } from 'lucide-react'
import type { ReactNode } from 'react'
import { teamColor } from '@/components/brand/team-color'
import { formatDateTime } from '@/lib/format-date-time'
import { revisionLabel } from './revision-label'

const CELL = 'border-primary border-r-2 px-4 py-3.5'

const StatusBadge = ({ confirmed }: { readonly confirmed: boolean }): ReactNode => (
  <span
    className={cn(
      'inline-flex items-center justify-center gap-1 border-2 border-primary px-2.5 py-1 font-bold font-headline text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a1a]',
      confirmed ? 'bg-[#d4f5df] text-[#0b5428]' : 'bg-primary-container text-primary',
    )}
  >
    {confirmed ? (
      <Check className="size-3.5" aria-hidden />
    ) : (
      <Clock className="size-3.5" aria-hidden />
    )}
    {confirmed ? 'Confirmada' : 'Pendiente'}
  </span>
)

const ConfirmedBy = ({ item }: { readonly item: ScoreNotification }): ReactNode =>
  item.confirmedAt === null ? (
    <span className="flex items-center gap-2 font-headline font-semibold text-secondary text-xs uppercase">
      <span className="h-0.5 w-3 bg-secondary" /> Notificación enviada
    </span>
  ) : (
    <div className="flex flex-col">
      <span className="font-bold font-headline text-primary text-xs uppercase">
        {item.confirmedByName ?? ''}
      </span>
      <span className="font-mono text-on-surface-variant text-xs tracking-tight">
        {formatDateTime(item.confirmedAt)}
      </span>
    </div>
  )

export const AuditRow = ({
  item,
  index,
}: {
  readonly item: ScoreNotification
  readonly index: number
}): ReactNode => {
  const pending = item.status === 'pending'
  return (
    <tr className={pending ? 'bg-[#fffbeb]' : 'hover:bg-surface-container-low'}>
      <td
        className={cn(
          CELL,
          'text-center font-bold font-headline text-xs',
          pending
            ? 'bg-primary-container text-primary'
            : 'bg-surface-container-low text-on-surface-variant',
        )}
      >
        {String(index + 1).padStart(2, '0')}
      </td>
      <td className={cn(CELL, 'font-bold font-headline text-primary')}>
        {item.raceName}
        <span className="block font-body font-normal text-[11px] text-on-surface-variant">
          Temporada {item.seasonYear}
        </span>
      </td>
      <td className={cn(CELL, 'font-headline font-semibold text-primary')}>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-block h-2.5 w-2.5 border border-primary',
              teamColor(item.teamName).solid,
            )}
          />
          <span>{item.teamName}</span>
        </div>
      </td>
      <td className={CELL}>
        <span
          className={cn(
            'inline-block border border-primary px-2 py-0.5 font-bold font-headline text-xs tracking-tight',
            item.resultsRevision > 1
              ? 'bg-primary-container text-primary'
              : 'bg-surface-container-high text-primary',
          )}
        >
          {revisionLabel(item.resultsRevision)}
        </span>
      </td>
      <td className={cn(CELL, 'text-center')}>
        <StatusBadge confirmed={!pending} />
      </td>
      <td className="px-4 py-3.5">
        <ConfirmedBy item={item} />
      </td>
    </tr>
  )
}
