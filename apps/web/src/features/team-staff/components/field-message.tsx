import type { ReactNode } from 'react'

export const FIELD_CLASS =
  'w-full border-2 border-outline bg-surface-container-lowest px-3 py-2 font-medium text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary-container disabled:bg-surface-container disabled:text-on-surface-variant aria-invalid:border-secondary aria-invalid:bg-secondary-container/40'

export const LABEL_CLASS = 'font-bold font-mono text-on-surface text-xs uppercase'

type Props = {
  readonly id: string
  readonly error: string | undefined
  readonly hint: string | undefined
}

export const describedBy = ({ id, error, hint }: Props): string | undefined => {
  if (error !== undefined) {
    return `${id}-error`
  }
  return hint === undefined ? undefined : `${id}-hint`
}

export const FieldMessage = ({ id, error, hint }: Props): ReactNode => {
  if (error !== undefined) {
    return (
      <p id={`${id}-error`} className="font-medium text-secondary text-xs">
        {error}
      </p>
    )
  }
  return hint === undefined ? null : (
    <p id={`${id}-hint`} className="text-on-surface-variant text-xs">
      {hint}
    </p>
  )
}
