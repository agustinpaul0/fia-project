import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { createTestQueryClient } from '@/testing/render-with-query'
import { TECHNICAL_CONTROLS_POLL_MS, useTechnicalControls } from './use-technical-controls'

const wrapper = ({ children }: { readonly children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
)

describe('Actualización automática de controles técnicos (US-24)', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('consulta de nuevo antes de los 10 minutos sin recargar la página', async () => {
    expect(TECHNICAL_CONTROLS_POLL_MS).toBeLessThan(10 * 60_000)
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const calls = mockFetchRoutes({ 'GET /technical-controls/mine': () => jsonResponse([]) })
    renderHook(() => useTechnicalControls(undefined, true), { wrapper })
    await waitFor(() => expect(calls).toHaveLength(1))
    await vi.advanceTimersByTimeAsync(TECHNICAL_CONTROLS_POLL_MS)
    await waitFor(() => expect(calls).toHaveLength(2))
  })
})
