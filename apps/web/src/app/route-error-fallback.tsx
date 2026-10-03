import type { ErrorComponentProps } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { ErrorState } from '@/components/common/error-state'
import { PageFrame } from '@/components/common/page-query-view'

export const RouteErrorFallback = ({ error, reset }: ErrorComponentProps): ReactNode => (
  <PageFrame>
    <ErrorState error={error} onRetry={reset} />
  </PageFrame>
)
