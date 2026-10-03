import type { ClassifiedResult } from '@fia/shared/contracts'
import { cn } from 'cn'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/empty-state'

export const NO_RESULTS_MESSAGE = 'Todavía no se cargó el resultado de esta carrera.'

const PODIUM: Readonly<Record<number, string>> = {
  1: 'bg-primary-container text-on-primary-container',
  2: 'bg-surface-variant text-on-surface',
  3: 'bg-secondary-container text-on-secondary',
}

const Position = ({ position }: { readonly position: number }): ReactNode => {
  const tone = PODIUM[position]
  return tone === undefined ? (
    <span className="font-bold font-headline text-on-surface text-xs">{position}</span>
  ) : (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center font-bold font-headline text-xs',
        tone,
      )}
    >
      {position}
    </span>
  )
}

const ResultRow = ({ result }: { readonly result: ClassifiedResult }): ReactNode => (
  <tr className="transition-colors odd:bg-surface even:bg-surface-container-low hover:bg-surface-container">
    <td className="px-4 py-3 text-center">
      <Position position={result.position} />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-bold font-mono text-on-surface-variant text-xs">
          {result.driverCode}
        </span>{' '}
        <span
          className={
            result.position <= 3
              ? 'font-bold font-headline text-on-surface'
              : 'font-medium text-on-surface'
          }
        >
          {result.driverName}
        </span>
      </div>
    </td>
    <td className="px-4 py-3 font-label text-on-surface-variant text-xs uppercase tracking-wider">
      {result.teamName}
    </td>
    <td className="px-4 py-3 text-right font-bold font-mono text-base text-on-surface">
      {result.points}
    </td>
  </tr>
)

export const ClassificationTable = ({
  results,
}: {
  readonly results: readonly ClassifiedResult[]
}): ReactNode => {
  if (results.length === 0) {
    return <EmptyState message={NO_RESULTS_MESSAGE} />
  }
  return (
    <div className="overflow-x-auto bg-surface-container-lowest">
      <table className="w-full text-left font-body">
        <thead>
          <tr className="bg-primary font-label text-[11px] text-on-primary uppercase tracking-widest">
            <th className="w-16 px-4 py-3 text-center">Pos.</th>
            <th className="px-4 py-3">Piloto</th>
            <th className="px-4 py-3">Escudería</th>
            <th className="w-24 px-4 py-3 text-right">Puntos</th>
          </tr>
        </thead>
        <tbody className="text-sm">
          {results.map((result) => (
            <ResultRow key={result.driverId} result={result} />
          ))}
        </tbody>
      </table>
    </div>
  )
}
