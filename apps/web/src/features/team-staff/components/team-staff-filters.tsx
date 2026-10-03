import type { TeamOption } from '@fia/shared/contracts'
import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import { EMPTY_FILTER, type StaffFilter } from '../staff-roster'

type Props = {
  readonly filter: StaffFilter
  readonly teams: readonly TeamOption[]
  readonly onChange: (filter: StaffFilter) => void
}

const FIELD =
  'w-full border-2 border-outline bg-surface py-2.5 font-medium text-sm focus:bg-surface-container-lowest focus:outline-none'

export const TeamStaffFilters = ({ filter, teams, onChange }: Props): ReactNode => (
  <section className="mb-6 border-2 border-outline bg-surface-container-lowest p-4 shadow-brutal">
    <div className="flex flex-col items-stretch gap-3 md:flex-row md:items-center">
      <label className="relative flex-1">
        <span className="sr-only">Buscar por nombre, email, escudería o legajo</span>
        <Search
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-[#6b7280]"
          aria-hidden
        />
        <input
          type="search"
          value={filter.text}
          onChange={(event) => onChange({ ...filter, text: event.target.value })}
          placeholder="Buscar por nombre, email, escudería o legajo..."
          className={`${FIELD} pr-4 pl-9 placeholder:text-[#6b7280]`}
        />
      </label>
      <label className="w-full md:w-64">
        <span className="sr-only">Filtrar por escudería</span>
        <select
          value={filter.teamId}
          onChange={(event) => onChange({ ...filter, teamId: event.target.value })}
          className={`${FIELD} px-3`}
        >
          <option value="">Todas las escuderías ({teams.length})</option>
          {teams.map((team) => (
            <option key={team.id} value={team.id}>
              {team.name}
            </option>
          ))}
        </select>
      </label>
      <button
        type="button"
        onClick={() => onChange(EMPTY_FILTER)}
        className="border-2 border-outline bg-[#e5e7eb] px-4 py-2.5 font-bold font-mono text-black text-xs uppercase tracking-wider transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-[#d1d5db] hover:shadow-brutal"
      >
        Limpiar
      </button>
    </div>
  </section>
)
