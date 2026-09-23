import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type RenderResult, render } from '@testing-library/react'
import type { ReactNode } from 'react'

export const createTestQueryClient = (): QueryClient =>
  new QueryClient({ defaultOptions: { queries: { retry: false } } })

export const renderWithQuery = (ui: ReactNode): RenderResult =>
  render(<QueryClientProvider client={createTestQueryClient()}>{ui}</QueryClientProvider>)
