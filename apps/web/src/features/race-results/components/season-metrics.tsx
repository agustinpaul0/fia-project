import type { DriverStanding, RaceSummary } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { lastWinner, pointsByTeam, racesWithResults } from '../season/season-summary'

type Props = {
  readonly standings: readonly DriverStanding[] | undefined
  readonly races: readonly RaceSummary[] | undefined
}

const Metric = ({
  label,
  value,
  highlight = false,
}: {
  readonly label: string
  readonly value: string
  readonly highlight?: boolean
}): ReactNode => (
  <div className="flex flex-col">
    <span className="text-[10px] text-surface-variant uppercase tracking-wider">{label}</span>
    <span
      className={`font-bold text-sm uppercase ${highlight ? 'text-primary-container' : 'text-on-primary'}`}
    >
      {value}
    </span>
  </div>
)

const leaderLabel = (standings: readonly DriverStanding[] | undefined): string => {
  const leader = standings?.[0]
  return leader === undefined ? '—' : `${leader.driverCode} · ${leader.points} pts`
}

const teamLabel = (standings: readonly DriverStanding[] | undefined): string =>
  pointsByTeam(standings ?? [])[0]?.teamName ?? '—'

const winnerLabel = (races: readonly RaceSummary[] | undefined): string => {
  const race = lastWinner(races ?? [])
  return race === null ? '—' : `R${String(race.round).padStart(2, '0')} · ${race.winnerName ?? ''}`
}

const roundsLabel = (races: readonly RaceSummary[] | undefined): string =>
  races === undefined ? '—' : `${racesWithResults(races)} de ${races.length} con resultado`

export const SeasonMetrics = ({ standings, races }: Props): ReactNode => (
  <section className="w-full bg-primary px-6 py-4 text-on-primary lg:px-8">
    <div className="mx-auto grid max-w-7xl grid-cols-2 gap-4 font-label text-xs md:grid-cols-4">
      <Metric label="Último ganador" value={winnerLabel(races)} highlight />
      <Metric label="Líder del campeonato" value={leaderLabel(standings)} />
      <Metric label="Escudería con más puntos" value={teamLabel(standings)} />
      <Metric label="Carreras" value={roundsLabel(races)} />
    </div>
  </section>
)
