import type { DriverStanding } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

export const StandingsTable = ({
  standings,
}: {
  readonly standings: readonly DriverStanding[]
}): ReactNode => (
  <table className="w-full text-sm">
    <thead className="border-b text-left text-muted-foreground">
      <tr>
        <th className="py-2">Pos.</th>
        <th>Piloto</th>
        <th>Escudería</th>
        <th className="text-right">Victorias</th>
        <th className="text-right">Puntos</th>
      </tr>
    </thead>
    <tbody>
      {standings.map((standing) => (
        <tr key={standing.driverId} className="border-b last:border-0">
          <td className="py-2 font-medium">{standing.position}</td>
          <td>
            <span className="font-mono">{standing.driverCode}</span> {standing.driverName}
          </td>
          <td>{standing.teamName}</td>
          <td className="text-right">{standing.wins}</td>
          <td className="text-right font-semibold">{standing.points}</td>
        </tr>
      ))}
    </tbody>
  </table>
)
