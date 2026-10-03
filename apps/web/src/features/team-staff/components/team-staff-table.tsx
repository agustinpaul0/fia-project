import type { TeamStaff } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { TeamStaffRow } from './team-staff-row'

export const NO_MATCHES_MESSAGE = 'Ningún integrante coincide con la búsqueda.'

type Props = {
  readonly members: readonly TeamStaff[]
  readonly total: number
  readonly onEdit: (member: TeamStaff) => void
  readonly onDeactivate: (member: TeamStaff) => void
}

const HEADERS = ['Nombre', 'Email oficial', 'Teléfono', 'Escudería', 'Cargo'] as const

export const TeamStaffTable = ({ members, total, onEdit, onDeactivate }: Props): ReactNode => (
  <section className="mb-12 overflow-hidden border-2 border-outline bg-surface-container-lowest shadow-brutal">
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-black border-b-2 bg-fia-black font-mono text-white text-xs uppercase tracking-wider">
            {HEADERS.map((header) => (
              <th key={header} scope="col" className="px-4 py-3 font-bold">
                {header}
              </th>
            ))}
            <th scope="col" className="px-4 py-3 text-center font-bold">
              Estado
            </th>
            <th scope="col" className="px-4 py-3 text-right font-bold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="divide-y-2 divide-black font-medium text-sm">
          {members.map((member) => (
            <TeamStaffRow
              key={member.id}
              member={member}
              onEdit={onEdit}
              onDeactivate={onDeactivate}
            />
          ))}
        </tbody>
      </table>
    </div>
    {members.length === 0 ? (
      <p className="px-4 py-8 text-center font-mono text-on-surface-variant text-sm">
        {NO_MATCHES_MESSAGE}
      </p>
    ) : null}
    <div className="flex items-center justify-between gap-3 border-outline border-t-2 bg-surface p-3 font-bold font-mono text-xs">
      <span className="text-[#374151]">
        Mostrando {members.length} de {total} cuentas registradas
      </span>
    </div>
  </section>
)
