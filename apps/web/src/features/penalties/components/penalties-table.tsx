import type { Penalty } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { PenaltiesRow } from './penalties-row'

export const PenaltiesTable = ({
  penalties,
}: {
  readonly penalties: readonly Penalty[]
}): ReactNode => (
  <div className="overflow-x-auto border-2 border-black bg-surface shadow-brutal">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b-2 border-black bg-surface-container-high font-bold font-mono text-xs uppercase tracking-wider text-on-surface">
          <th className="px-4 py-3">Fecha / Evento</th>
          <th className="px-4 py-3">Categoría</th>
          <th className="px-4 py-3">Sancionado</th>
          <th className="px-4 py-3">Tipo</th>
          <th className="px-4 py-3">Sanción</th>
          <th className="px-4 py-3">Motivo</th>
        </tr>
      </thead>
      <tbody>
        {penalties.map((penalty) => (
          <PenaltiesRow key={penalty.id} penalty={penalty} />
        ))}
      </tbody>
    </table>
    <div className="flex items-center justify-between border-t-2 border-outline bg-surface p-3 font-bold font-mono text-xs text-[#374151]">
      <span>Total de sanciones registradas: {penalties.length}</span>
    </div>
  </div>
)
