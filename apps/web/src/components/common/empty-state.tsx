import type { ReactNode } from 'react'

type EmptyStateProps = { readonly message: string }

export const EmptyState = ({ message }: EmptyStateProps): ReactNode => (
  <p className="rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
    {message}
  </p>
)
