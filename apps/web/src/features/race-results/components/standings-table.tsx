import type { DriverStanding } from '@fia/shared/contracts'
import { cn } from 'cn'
import type { ReactNode } from 'react'

const PODIUM: Readonly<Record<number, string>> = {
  1: 'bg-primary-container text-on-primary-container',
  2: 'bg-surface-container-highest text-on-surface',
  3: 'bg-secondary-fixed text-secondary',
}

const pointsTone = (position: number): string => {
  if (position === 1) {
    return 'bg-primary-container text-on-primary-container'
  }
  return position <= 3
    ? 'bg-surface-container-high text-on-surface'
    : 'bg-surface-container text-on-surface'
}

const Position = ({ position }: { readonly position: number }): ReactNode => {
  const tone = PODIUM[position]
  return tone === undefined ? (
    <span className="font-bold font-headline text-on-surface-variant text-xs">{position}</span>
  ) : (
    <span
      className={cn(
        'inline-flex h-7 w-7 items-center justify-center font-bold font-headline text-xs shadow-sm',
        tone,
      )}
    >
      {position}
    </span>
  )
}

const StandingRow = ({ standing }: { readonly standing: DriverStanding }): ReactNode => (
  <tr className="transition-colors odd:bg-surface-bright hover:bg-surface-container">
    <td className="px-3 py-3 text-center">
      <Position position={standing.position} />
    </td>
    <td className="px-4 py-3">
      <div className="flex items-center gap-2">
        <span className="font-bold font-headline text-on-surface text-sm tracking-tight">
          {standing.driverCode}
        </span>{' '}
        <span className="text-on-surface-variant text-xs">{standing.driverName}</span>
      </div>
    </td>
    <td className="hidden px-3 py-3 font-label text-on-surface-variant text-xs uppercase sm:table-cell">
      {standing.teamName}
    </td>
    <td className="px-3 py-3 text-right font-label font-medium text-on-surface">{standing.wins}</td>
    <td className="px-4 py-3 text-right font-bold font-headline text-base text-on-surface">
      <span className={cn('whitespace-nowrap px-2 py-1', pointsTone(standing.position))}>
        {standing.points} pts
      </span>
    </td>
  </tr>
)

export const StandingsTable = ({
  standings,
}: {
  readonly standings: readonly DriverStanding[]
}): ReactNode => (
  <div className="overflow-x-auto">
    <table className="w-full border-collapse text-left font-body text-sm">
      <thead>
        <tr className="bg-surface-container-high font-bold font-label text-[11px] text-on-surface-variant uppercase tracking-wider">
          <th className="w-14 px-3 py-3 text-center">Pos.</th>
          <th className="px-4 py-3">Piloto</th>
          <th className="hidden px-3 py-3 sm:table-cell">Escudería</th>
          <th className="px-3 py-3 text-right">Victorias</th>
          <th className="px-4 py-3 text-right">Puntos</th>
        </tr>
      </thead>
      <tbody className="text-xs lg:text-sm">
        {standings.map((standing) => (
          <StandingRow key={standing.driverId} standing={standing} />
        ))}
      </tbody>
    </table>
  </div>
)
