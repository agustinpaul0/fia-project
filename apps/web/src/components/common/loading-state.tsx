import type { ReactNode } from 'react'
import { Skeleton } from '@/components/ui/skeleton'

const PLACEHOLDER_ROWS = ['a', 'b', 'c'] as const

export const LoadingState = (): ReactNode => (
  <div role="status" aria-label="Cargando" className="flex flex-col gap-2">
    {PLACEHOLDER_ROWS.map((row) => (
      <Skeleton key={row} className="h-12 w-full border-2 border-outline-variant" />
    ))}
  </div>
)
