import type { ClassifiedResult } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { teamColor } from '@/components/brand/team-color'
import { pointsByTeam, shareOf } from '../season/season-summary'

export const PointsDistribution = ({
  results,
}: {
  readonly results: readonly ClassifiedResult[]
}): ReactNode => {
  const teams = pointsByTeam(results).filter((team) => team.points > 0)
  const total = teams.reduce((sum, team) => sum + team.points, 0)
  return (
    <section className="flex flex-col gap-3 bg-surface-container-low p-5">
      <h3 className="font-bold font-label text-[11px] text-on-surface uppercase tracking-wider">
        Distribución de puntos por escudería
      </h3>
      {teams.length === 0 ? (
        <p className="font-mono text-on-surface-variant text-xs">Sin puntos otorgados todavía.</p>
      ) : (
        <ul className="space-y-2">
          {teams.map((team) => (
            <li key={team.teamName}>
              <div className="mb-1 flex justify-between font-mono text-xs">
                <span>{team.teamName}</span>
                <span className="font-bold">{team.points} pts</span>
              </div>
              <div className="h-2 w-full overflow-hidden bg-surface-variant">
                <div
                  className={`h-full ${teamColor(team.teamName).solid}`}
                  style={{ width: `${shareOf(team.points, total)}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
