import type { TechnicalControlStatus } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

const LABELS: Record<TechnicalControlStatus, string> = {
  passed: 'Aprobado',
  rejected: 'Rechazado',
}

const STYLES: Record<TechnicalControlStatus, string> = {
  passed: 'bg-emerald-100 text-emerald-900 border-emerald-500',
  rejected: 'bg-red-100 text-red-900 border-red-500',
}

export const TechnicalControlStatusBadge = ({
  status,
}: {
  readonly status: TechnicalControlStatus
}): ReactNode => (
  <span
    className={`inline-flex items-center border px-2 py-0.5 font-bold font-mono text-[11px] uppercase tracking-wider ${STYLES[status]}`}
  >
    {LABELS[status]}
  </span>
)
