import type { TeamOption } from '@fia/shared/contracts'
import type { ComponentProps, ReactNode } from 'react'

type Props = Omit<ComponentProps<'select'>, 'children'> & {
  readonly label: string
  readonly id: string
  readonly teams: readonly TeamOption[]
}

export const TeamSelectField = ({ label, id, teams, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-bold font-mono text-on-surface text-xs uppercase">
      {label}
    </label>
    <select
      id={id}
      className="w-full border-2 border-outline bg-surface-container-lowest px-3 py-2 font-medium text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container disabled:bg-surface-container disabled:text-on-surface-variant"
      {...props}
    >
      <option value="">Seleccionar escudería</option>
      {teams.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  </div>
)
