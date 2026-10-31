import type { Driver } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { TeamDriverRow } from './team-driver-row'

export const NO_DRIVERS_MESSAGE = 'No hay pilotos inscriptos en tu escudería.'

const HEADERS = ['Dorsal', 'Piloto', 'Código', 'Nacionalidad', 'Licencia', 'Condición'] as const

export const TeamDriversTable = ({
  drivers,
  onEdit,
}: {
  readonly drivers: readonly Driver[]
  readonly onEdit?: ((driver: Driver) => void) | undefined
}): ReactNode => {
  const headers = onEdit ? [...HEADERS, 'Acciones'] : HEADERS
  return (
    <section className="mb-12 overflow-hidden border-2 border-outline bg-surface-container-lowest shadow-brutal">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="border-black border-b-2 bg-fia-black font-bold font-mono text-white text-xs uppercase tracking-wider">
              {headers.map((h) => (
                <th key={h} scope="col" className="px-4 py-3">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y-2 divide-black font-medium text-sm">
            {drivers.map((driver) => (
              <TeamDriverRow key={driver.id} driver={driver} onEdit={onEdit} />
            ))}
          </tbody>
        </table>
      </div>
      {drivers.length === 0 ? (
        <p className="px-4 py-8 text-center font-mono text-on-surface-variant text-sm">
          {NO_DRIVERS_MESSAGE}
        </p>
      ) : null}
      <div className="flex items-center justify-between gap-3 border-outline border-t-2 bg-surface p-3 font-bold font-mono text-xs">
        <span className="text-[#374151]">
          Total inscriptos: {drivers.length} ({drivers.filter((d) => d.role === 'main').length}{' '}
          titulares, {drivers.filter((d) => d.role === 'reserve').length} suplentes)
        </span>
      </div>
    </section>
  )
}
