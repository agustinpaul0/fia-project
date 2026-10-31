import type { RaceStatus } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

export const RaceStatusBadge = ({
  status,
}: {
  readonly status?: RaceStatus | undefined
}): ReactNode => {
  if (!status || status === 'scheduled') {
    return null
  }
  const isCancelled = status === 'cancelled'
  return (
    <span
      className={`inline-block border px-2 py-0.5 font-bold font-mono text-[10px] uppercase tracking-wider ${
        isCancelled
          ? 'border-secondary bg-red-100 text-red-900'
          : 'border-amber-600 bg-amber-100 text-amber-900'
      }`}
    >
      {isCancelled ? 'Cancelado' : 'Modificado'}
    </span>
  )
}
