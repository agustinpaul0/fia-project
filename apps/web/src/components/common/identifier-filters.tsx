import { type ReactNode, useState } from 'react'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import { EMPTY_FILTERS_MESSAGE } from './data-filters-bar'
import { LABEL } from './data-filters-fields'

export type IdentifiedItem = {
  readonly teamId: string
  readonly teamName: string
  readonly driverId: string | null
  readonly driverName: string | null
}

type Option = { readonly id: string; readonly name: string }

const optionsOf = (pairs: readonly (Option | null)[]): readonly Option[] =>
  [...new Map(pairs.flatMap((p) => (p ? [[p.id, p] as const] : []))).values()].sort((a, b) =>
    a.name.localeCompare(b.name),
  )

const OptionSelect = (p: {
  readonly id: string
  readonly label: string
  readonly options: readonly Option[]
  readonly value: string
  readonly onChange: (value: string) => void
}): ReactNode => (
  <div className="flex items-center gap-2">
    <label htmlFor={p.id} className={LABEL}>
      {p.label}
    </label>
    <select
      id={p.id}
      value={p.value}
      onChange={(e) => p.onChange(e.target.value)}
      className={`${FIELD_CLASS} w-auto font-mono text-xs`}
    >
      <option value="">Todos</option>
      {p.options.map((o) => (
        <option key={o.id} value={o.id}>
          {o.name}
        </option>
      ))}
    </select>
  </div>
)

export const IdentifierFilters = <T extends IdentifiedItem>({
  items,
  children,
}: {
  readonly items: readonly T[]
  readonly children: (visible: readonly T[]) => ReactNode
}): ReactNode => {
  const [teamId, setTeamId] = useState('')
  const [driverId, setDriverId] = useState('')
  const teams = optionsOf(items.map((i) => ({ id: i.teamId, name: i.teamName })))
  const drivers = optionsOf(
    items.map((i) => (i.driverId && i.driverName ? { id: i.driverId, name: i.driverName } : null)),
  )
  const visible = items.filter(
    (i) => (!teamId || i.teamId === teamId) && (!driverId || i.driverId === driverId),
  )
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <OptionSelect
          id="filter-team"
          label="Escudería:"
          options={teams}
          value={teamId}
          onChange={setTeamId}
        />
        <OptionSelect
          id="filter-driver"
          label="Piloto:"
          options={drivers}
          value={driverId}
          onChange={setDriverId}
        />
      </div>
      {visible.length === 0 ? (
        <p className="font-mono text-on-surface-variant text-sm">{EMPTY_FILTERS_MESSAGE}</p>
      ) : (
        children(visible)
      )}
    </div>
  )
}
