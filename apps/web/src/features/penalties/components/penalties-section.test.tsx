import type { Penalty } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { PenaltiesSection } from './penalties-section'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(() => ({ data: { user: { role: 'fia_admin' } } })),
}))

const mockPenalty: Penalty = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'Ferrari',
  categoryCode: 'F1',
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Charles Leclerc',
  raceId: null,
  raceName: null,
  type: 'time_penalty',
  penalty: '5 segundos',
  reason: 'Límites de pista.',
  issuedAt: '2026-05-24T14:30:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('PenaltiesSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra estado vacío cuando no hay sanciones registradas', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<PenaltiesSection />)

    expect(
      await screen.findByText(
        'No se encontraron sanciones registradas para los filtros aplicados.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Nueva sanción' })).toBeInTheDocument()
  })

  it('muestra el listado de sanciones con todos los datos necesarios', async () => {
    mockFetchOnce(jsonResponse([mockPenalty]))
    renderWithQuery(<PenaltiesSection />)

    expect(await screen.findByText('Charles Leclerc')).toBeInTheDocument()
    expect(screen.getByText('(Ferrari)')).toBeInTheDocument()
    expect(screen.getByText('5 segundos')).toBeInTheDocument()
    expect(screen.getByText('Límites de pista.')).toBeInTheDocument()
    expect(screen.getAllByText('Recargo de tiempo').length).toBeGreaterThanOrEqual(1)
  })

  it('abre el diálogo de nueva sanción al pulsar el botón', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<PenaltiesSection />)

    const btn = await screen.findByRole('button', { name: '+ Nueva sanción' })
    fireEvent.click(btn)

    expect(screen.getByText('Registrar nueva sanción')).toBeInTheDocument()
  })
})
