import type { TechnicalControlType } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

const LABELS: Record<TechnicalControlType, string> = {
  weight: 'Pesaje',
  fuel: 'Combustible',
  dimensions: 'Dimensiones',
  engine: 'Motor y Potencia',
  safety: 'Seguridad',
  post_race: 'Post-Carrera',
}

const STYLES: Record<TechnicalControlType, string> = {
  weight: 'bg-indigo-100 text-indigo-900 border-indigo-400',
  fuel: 'bg-amber-100 text-amber-900 border-amber-400',
  dimensions: 'bg-sky-100 text-sky-900 border-sky-400',
  engine: 'bg-purple-100 text-purple-900 border-purple-400',
  safety: 'bg-teal-100 text-teal-900 border-teal-400',
  post_race: 'bg-surface-container text-on-surface-variant border-outline',
}

export const TechnicalControlTypeBadge = ({
  type,
}: {
  readonly type: TechnicalControlType
}): ReactNode => (
  <span
    className={`inline-flex items-center border px-2 py-0.5 font-bold font-mono text-[11px] uppercase tracking-wider ${STYLES[type]}`}
  >
    {LABELS[type]}
  </span>
)
