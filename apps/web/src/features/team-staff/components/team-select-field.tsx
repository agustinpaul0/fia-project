import type { TeamOption } from '@fia/shared/contracts'
import type { ComponentProps, ReactNode } from 'react'

type Props = Omit<ComponentProps<'select'>, 'children'> & {
  readonly label: string
  readonly id: string
  readonly teams: readonly TeamOption[]
}

export const TeamSelectField = ({ label, id, teams, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-foreground">
      {label}
    </label>
    <select
      id={id}
      className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted"
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
