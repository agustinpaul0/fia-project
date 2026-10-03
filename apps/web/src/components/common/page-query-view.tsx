import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'

type Props<Data> = {
  readonly query: UseQueryResult<Data>
  readonly children: (data: Data) => ReactNode
}

export const PageFrame = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <div className="mx-auto w-full max-w-7xl px-6 py-10 lg:px-8">{children}</div>
)

export const PageQueryView = <Data,>({ query, children }: Props<Data>): ReactNode => {
  if (query.isPending) {
    return (
      <PageFrame>
        <LoadingState />
      </PageFrame>
    )
  }
  if (query.isError) {
    return (
      <PageFrame>
        <ErrorState error={query.error} onRetry={() => void query.refetch()} />
      </PageFrame>
    )
  }
  return children(query.data)
}
