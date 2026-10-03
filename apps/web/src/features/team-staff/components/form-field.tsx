import type { ComponentProps, ReactNode } from 'react'

type Props = ComponentProps<'input'> & {
  readonly label: string
  readonly id: string
}

export const FormField = ({ label, id, ...props }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className="font-bold font-mono text-on-surface text-xs uppercase">
      {label}
    </label>
    <input
      id={id}
      className="w-full border-2 border-outline bg-surface-container-lowest px-3 py-2 font-medium text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container disabled:bg-surface-container disabled:text-on-surface-variant"
      {...props}
    />
  </div>
)
