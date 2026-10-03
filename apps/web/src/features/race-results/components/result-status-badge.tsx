import type { ReactNode } from 'react'

type Props = {
  readonly revision: number
  readonly hasResults: boolean
}

export const resultStatusLabel = ({ revision, hasResults }: Props): string => {
  if (!hasResults) {
    return 'Resultado pendiente'
  }
  return revision > 1 ? `Corregido (revisión ${revision})` : 'Oficial final'
}

export const ResultStatusBadge = (props: Props): ReactNode =>
  props.hasResults ? (
    <span className="flex items-center gap-1.5 bg-secondary px-2.5 py-1 font-bold font-label text-[11px] text-on-secondary uppercase tracking-wider">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-surface-container-lowest" />
      {resultStatusLabel(props)}
    </span>
  ) : (
    <span className="border border-surface-variant px-2.5 py-1 font-bold font-label text-[11px] text-surface-variant uppercase tracking-wider">
      {resultStatusLabel(props)}
    </span>
  )
