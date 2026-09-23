import type { ErrorComponentProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/common/error-state'

export const RouteErrorFallback = ({ error, reset }: ErrorComponentProps): ReactNode => (
  <div className="mx-auto max-w-xl p-6">
    <ErrorState error={error} onRetry={reset} />
  </div>
)
