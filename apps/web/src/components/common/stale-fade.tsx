import { cn } from 'cn'
import type { ReactNode } from 'react'

type Props = {
  readonly stale: boolean
  readonly children: ReactNode
}

export const StaleFade = ({ stale, children }: Props): ReactNode => (
  <div
    aria-busy={stale}
    className={cn('transition-opacity duration-300 ease-out', stale ? 'opacity-50' : 'opacity-100')}
  >
    {children}
  </div>
)
