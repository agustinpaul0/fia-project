import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aPenalty } from '@/testing/penalty-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { NO_PENDING_PENALTIES, PendingPenaltiesPanel } from './pending-penalties-panel'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const PENDING = aPenalty({ notificationStatus: 'pending' })

describe('PendingPenaltiesPanel (US-15)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('avisa la sanción aplicada y la confirma con un clic', async () => {
    let confirmed = false
    const calls = mockFetchRoutes({
      'GET /penalties/pending': () => jsonResponse(confirmed ? [] : [PENDING]),
      [`POST /penalties/${PENDING.id}/confirm`]: () => {
        confirmed = true
        return jsonResponse({
          ...PENDING,
          notificationStatus: 'confirmed',
          confirmedAt: '2026-05-25T10:00:00.000Z',
          confirmedByName: 'Fred',
        })
      },
    })
    renderWithQuery(<PendingPenaltiesPanel />)
    expect(await screen.findByText(/5 segundos — Charles Leclerc/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar recepción' }))
    expect(await screen.findByText(NO_PENDING_PENALTIES)).toBeInTheDocument()
    await waitFor(() => expect(calls.filter((c) => c.key.startsWith('POST'))).toHaveLength(1))
  })
})
