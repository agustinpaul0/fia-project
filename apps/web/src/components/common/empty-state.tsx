import type { ReactNode } from 'react'

type EmptyStateProps = { readonly message: string }

export const EmptyState = ({ message }: EmptyStateProps): ReactNode => (
  <p className="border-2 border-outline border-dashed bg-surface-container-low px-6 py-10 text-center font-label text-on-surface-variant text-sm uppercase tracking-wider">
    {message}
  </p>
)
