import type { TechnicalControl } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { TechnicalControlsRow } from './technical-controls-row'

export const TechnicalControlsTable = ({
  controls,
}: {
  readonly controls: readonly TechnicalControl[]
}): ReactNode => (
  <div className="overflow-x-auto border-2 border-black bg-surface shadow-brutal">
    <table className="w-full text-left border-collapse">
      <thead>
        <tr className="border-b-2 border-black bg-surface-container-high font-bold font-mono text-xs uppercase tracking-wider text-on-surface">
          <th className="px-4 py-3">Fecha / Evento</th>
          <th className="px-4 py-3">Vehículo / Escudería</th>
          <th className="px-4 py-3">Tipo de control</th>
          <th className="px-4 py-3">Dictamen</th>
          <th className="px-4 py-3">Expiración</th>
          <th className="px-4 py-3">Observaciones</th>
        </tr>
      </thead>
      <tbody>
        {controls.map((control) => (
          <TechnicalControlsRow key={control.id} control={control} />
        ))}
      </tbody>
    </table>
    <div className="flex items-center justify-between border-t-2 border-outline bg-surface p-3 font-bold font-mono text-xs text-[#374151]">
      <span>Total de controles registrados: {controls.length}</span>
    </div>
  </div>
)
