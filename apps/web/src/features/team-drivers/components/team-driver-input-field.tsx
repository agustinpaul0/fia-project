import type { ReactNode } from 'react'
import { LABEL_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly id: string
  readonly label: string
  readonly error?: string | undefined
  readonly children: ReactNode
}

export const TeamDriverInputField = ({ id, label, error, children }: Props): ReactNode => (
  <div className="flex flex-col gap-1">
    <label htmlFor={id} className={LABEL_CLASS}>
      {label}
    </label>
    {children}
    {error && <span className="text-secondary text-xs">{error}</span>}
  </div>
)
