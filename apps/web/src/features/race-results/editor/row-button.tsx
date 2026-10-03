import { cn } from 'cn'
import type { ReactNode } from 'react'

type Props = {
  readonly label: string
  readonly disabled?: boolean
  readonly danger?: boolean
  readonly onClick: () => void
  readonly children: ReactNode
}

export const RowButton = (props: Props): ReactNode => (
  <button
    type="button"
    aria-label={props.label}
    title={props.label}
    disabled={props.disabled ?? false}
    onClick={props.onClick}
    className={cn(
      'flex h-9 w-9 items-center justify-center border-2 border-primary bg-surface-container-lowest font-bold shadow-[2px_2px_0px_0px_#1a1a1a] active:translate-y-0.5 active:shadow-none disabled:opacity-40',
      props.danger === true
        ? 'text-secondary hover:bg-secondary hover:text-on-primary'
        : 'text-primary hover:bg-primary-container',
    )}
  >
    {props.children}
  </button>
)
