import type { RaceType } from '@fia/shared/domain'
import { cn } from 'cn'
import type { ReactNode } from 'react'

export const RACE_TYPE_LABELS: Readonly<Record<RaceType, string>> = {
  grand_prix: 'Gran Premio',
  sprint: 'Sprint',
}

const SHORT: Readonly<Record<RaceType, string>> = { grand_prix: 'GP', sprint: 'Sprint' }

const TONE: Readonly<Record<RaceType, string>> = {
  grand_prix: 'bg-primary-container text-on-primary-container',
  sprint: 'bg-tertiary text-on-tertiary',
}

type Props = {
  readonly type: RaceType
  readonly className?: string
}

export const RaceTypeBadge = ({ type, className }: Props): ReactNode => (
  <span
    className={cn(
      'inline-flex items-center px-2 py-0.5 font-bold font-label text-[10px] uppercase tracking-wider shadow-xs',
      TONE[type],
      className,
    )}
  >
    <abbr title={RACE_TYPE_LABELS[type]} className="no-underline">
      {SHORT[type]}
    </abbr>
  </span>
)
