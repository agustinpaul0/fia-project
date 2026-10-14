import type { PenaltyType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

const LABELS: Record<PenaltyType, string> = {
  time_penalty: 'Recargo de tiempo',
  grid_penalty: 'Puestos en grilla',
  points_deduction: 'Quita de puntos',
  disqualification: 'Descalificación',
  fine: 'Multa económica',
  reprimand: 'Apercibimiento',
}

const STYLES: Record<PenaltyType, string> = {
  time_penalty: 'bg-amber-100 text-amber-900 border-amber-400',
  grid_penalty: 'bg-sky-100 text-sky-900 border-sky-400',
  points_deduction: 'bg-orange-100 text-orange-900 border-orange-400',
  disqualification: 'bg-red-100 text-red-900 border-red-400',
  fine: 'bg-emerald-100 text-emerald-900 border-emerald-400',
  reprimand: 'bg-surface-container text-on-surface-variant border-outline',
}

export const PenaltyTypeBadge = ({ type }: { readonly type: PenaltyType }): ReactNode => (
  <span
    className={`inline-flex items-center border px-2 py-0.5 font-bold font-mono text-[11px] uppercase tracking-wider ${STYLES[type]}`}
  >
    {LABELS[type]}
  </span>
)
