import { ChevronDown } from 'lucide-react'
import type { ReactNode } from 'react'

type Props = {
  readonly seasons: readonly number[]
  readonly value: number
  readonly onChange: (season: number) => void
}

export const SeasonSelect = ({ seasons, value, onChange }: Props): ReactNode => (
  <label className="flex flex-col text-left">
    <span className="mb-1.5 block font-bold font-label text-[11px] text-on-surface-variant uppercase tracking-wider">
      Selección de temporada
    </span>
    <span className="relative block w-full md:w-64">
      <span className="pointer-events-none absolute top-1/2 left-4 h-2 w-2 -translate-y-1/2 rounded-full bg-primary-container" />
      <select
        className="w-full appearance-none bg-primary py-3 pr-10 pl-9 font-bold font-label text-on-primary text-sm uppercase tracking-wider outline-none transition-colors hover:bg-surface-tint focus-visible:ring-3 focus-visible:ring-ring/50"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      >
        {seasons.map((season) => (
          <option
            key={season}
            value={season}
            className="bg-surface-container-lowest text-on-surface"
          >
            Temporada {season}
          </option>
        ))}
      </select>
      <ChevronDown
        className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-on-primary"
        aria-hidden
      />
    </span>
  </label>
)
