import type { ComponentProps, ReactNode } from 'react'

type Props = ComponentProps<'input'> & {
  readonly label: string
  readonly id: string
}

export const FormField = ({ label, id, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="text-xs font-medium text-foreground">
      {label}
    </label>
    <input
      id={id}
      className="rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-ring disabled:bg-muted"
      {...props}
    />
  </div>
)
