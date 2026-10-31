import type { PublicDriver } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { OfficialBadge } from '@/components/brand/official-badge'
import { QueryView } from '@/components/common/query-view'
import { usePublicDrivers } from '../hooks/use-public-drivers'

const ROLE_LABEL = { main: 'Titular', reserve: 'Suplente' } as const

const DriverRow = ({ driver }: { readonly driver: PublicDriver }): ReactNode => (
  <tr className="border-outline border-b">
    <td className="px-4 py-3 font-mono text-xs">{driver.teamName ?? 'Sin escudería'}</td>
    <td className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-bold font-headline text-sm">{`${driver.firstName} ${driver.lastName}`}</span>
        {driver.hasOfficialAccount ? <OfficialBadge label="Piloto oficial" /> : null}
      </div>
    </td>
    <td className="px-4 py-3 font-mono text-xs">{driver.code}</td>
    <td className="px-4 py-3 font-mono text-xs">#{driver.number}</td>
    <td className="px-4 py-3 text-xs">{driver.country}</td>
    <td className="px-4 py-3 font-bold font-mono text-xs uppercase">{ROLE_LABEL[driver.role]}</td>
  </tr>
)

const DriversTable = ({ drivers }: { readonly drivers: readonly PublicDriver[] }): ReactNode => (
  <div className="overflow-x-auto border-2 border-black bg-surface shadow-brutal">
    <table className="w-full text-left">
      <thead className="bg-surface-container font-bold font-mono text-xs uppercase">
        <tr>
          {['Escudería', 'Piloto', 'Código', 'Dorsal', 'País', 'Condición'].map((h) => (
            <th key={h} className="px-4 py-3">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {drivers.map((d) => (
          <DriverRow key={d.id} driver={d} />
        ))}
      </tbody>
    </table>
  </div>
)

export const PublicDriversSection = (): ReactNode => (
  <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
    <div className="border-2 border-black bg-surface p-6 shadow-brutal">
      <h1 className="font-bold font-headline text-2xl uppercase">Nómina de pilotos</h1>
      <p className="font-mono text-on-surface-variant text-sm">
        Titulares y suplentes de cada escudería, tal como las escuderías los cargaron.
      </p>
    </div>
    <QueryView
      query={usePublicDrivers()}
      isEmpty={(d) => d.length === 0}
      emptyMessage="Todavía no hay pilotos registrados."
    >
      {(drivers) => <DriversTable drivers={drivers} />}
    </QueryView>
  </div>
)
