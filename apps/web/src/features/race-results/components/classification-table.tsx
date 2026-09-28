import type { ClassifiedResult } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/empty-state'

export const NO_RESULTS_MESSAGE = 'Todavía no se cargó el resultado de esta carrera.'

type Props = { readonly results: readonly ClassifiedResult[] }

export const ClassificationTable = ({ results }: Props): ReactNode => {
  if (results.length === 0) {
    return <EmptyState message={NO_RESULTS_MESSAGE} />
  }
  return (
    <table className="w-full text-sm">
      <thead className="border-b text-left text-muted-foreground">
        <tr>
          <th className="py-2">Pos.</th>
          <th>Piloto</th>
          <th>Escudería</th>
          <th className="text-right">Puntos</th>
        </tr>
      </thead>
      <tbody>
        {results.map((result) => (
          <tr key={result.driverId} className="border-b last:border-0">
            <td className="py-2 font-medium">{result.position}</td>
            <td>
              <span className="font-mono">{result.driverCode}</span> {result.driverName}
            </td>
            <td>{result.teamName}</td>
            <td className="text-right font-semibold">{result.points}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
