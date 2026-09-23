import type { UseQueryResult } from '@tanstack/react-query'
import type { ReactNode } from 'react'
import { EmptyState } from './empty-state'
import { ErrorState } from './error-state'
import { LoadingState } from './loading-state'

type QueryViewProps<Data> = {
  readonly query: UseQueryResult<Data>
  readonly isEmpty: (data: Data) => boolean
  readonly emptyMessage: string
  readonly children: (data: Data) => ReactNode
}

export const QueryView = <Data,>({
  query,
  isEmpty,
  emptyMessage,
  children,
}: QueryViewProps<Data>): ReactNode => {
  if (query.isPending) {
    return <LoadingState />
  }
  if (query.isError) {
    return <ErrorState error={query.error} onRetry={() => void query.refetch()} />
  }
  if (isEmpty(query.data)) {
    return <EmptyState message={emptyMessage} />
  }
  return children(query.data)
}
