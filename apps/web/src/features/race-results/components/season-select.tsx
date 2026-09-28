import type { ReactNode } from 'react'

type Props = {
  readonly seasons: readonly number[]
  readonly value: number
  readonly onChange: (season: number) => void
}

export const SeasonSelect = ({ seasons, value, onChange }: Props): ReactNode => (
  <label className="flex items-center gap-2 text-sm">
    Temporada
    <select
      className="rounded-md border bg-background px-2 py-1"
      value={value}
      onChange={(event) => onChange(Number(event.target.value))}
    >
      {seasons.map((season) => (
        <option key={season} value={season}>
          {season}
        </option>
      ))}
    </select>
  </label>
)
