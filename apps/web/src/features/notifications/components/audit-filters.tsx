import { Search } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AuditFilter, AuditStats, AuditStatusFilter } from '../audit-log'

type Props = {
  readonly filter: AuditFilter
  readonly stats: AuditStats
  readonly onChange: (filter: AuditFilter) => void
}

const CHIP =
  'px-2.5 py-1 font-bold font-headline text-[11px] uppercase tracking-wider transition-colors'

export const AuditFilters = ({ filter, stats, onChange }: Props): ReactNode => {
  const options: readonly (readonly [AuditStatusFilter, string])[] = [
    ['all', 'Todas'],
    ['confirmed', `Confirmadas (${stats.confirmed})`],
    ['pending', `Pendientes (${stats.pending})`],
  ]
  return (
    <div className="flex flex-col items-stretch gap-3 border-2 border-primary bg-surface-container-lowest p-4 shadow-[4px_4px_0px_0px_#1a1a1a] sm:flex-row sm:items-center">
      <label className="relative min-w-[240px] flex-1">
        <span className="sr-only">Buscar por carrera o escudería</span>
        <Search
          className="absolute top-1/2 left-2 size-5 -translate-y-1/2 text-primary"
          aria-hidden
        />
        <input
          type="search"
          value={filter.text}
          onChange={(event) => onChange({ ...filter, text: event.target.value })}
          placeholder="Buscar por carrera o escudería..."
          className="w-full border-primary border-b-2 bg-surface-container py-2 pr-3 pl-9 font-bold font-headline text-primary text-xs uppercase tracking-wider placeholder:text-on-surface-variant focus:bg-primary-container focus:outline-none"
        />
      </label>
      <fieldset className="flex items-center gap-1 self-start border-2 border-primary bg-surface-container p-0.5 sm:self-auto">
        <legend className="sr-only">Filtrar por estado</legend>
        {options.map(([value, label]) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter.status === value}
            onClick={() => onChange({ ...filter, status: value })}
            className={
              filter.status === value
                ? `${CHIP} bg-primary text-on-primary`
                : `${CHIP} text-primary hover:bg-primary-container`
            }
          >
            {label}
          </button>
        ))}
      </fieldset>
    </div>
  )
}
