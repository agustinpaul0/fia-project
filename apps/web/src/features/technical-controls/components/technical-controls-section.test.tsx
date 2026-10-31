import type { TechnicalControl } from '@fia/shared/contracts'
import { fireEvent, screen, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { TechnicalControlsSection } from './technical-controls-section'

const mockUseSession = vi.fn(() => ({ data: { user: { role: 'fia_admin' } } }))

vi.mock('@/lib/auth-client', () => ({
  useSession: () => mockUseSession(),
}))

const mockControl: TechnicalControl = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'Ferrari',
  driverId: '00000000-0000-4000-8000-000000000020',
  driverName: 'Charles Leclerc',
  carNumber: 16,
  raceId: null,
  raceName: null,
  controlType: 'weight',
  status: 'passed',
  notes: 'Pesaje reglamentario.',
  inspectedAt: '2026-05-24T14:30:00.000Z',
  expiresAt: '2026-05-24T20:00:00.000Z',
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('TechnicalControlsSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    mockUseSession.mockReturnValue({ data: { user: { role: 'fia_admin' } } })
  })

  it('muestra estado vacío cuando no hay controles registrados', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TechnicalControlsSection />)

    expect(await screen.findByText('Sin resultados.')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Nuevo control técnico' })).toBeInTheDocument()
  })

  it('muestra el listado de controles con datos requeridos y destaca rechazados', async () => {
    const rejected: TechnicalControl = {
      ...mockControl,
      id: '00000000-0000-4000-8000-000000000002',
      status: 'rejected',
      notes: 'Alerón trasero excede tolerancia.',
    }
    mockFetchOnce(jsonResponse([mockControl, rejected]))
    renderWithQuery(<TechnicalControlsSection />)

    expect(within(await screen.findByRole('table')).getAllByText(/Ferrari/)).toHaveLength(2)
    expect(screen.getByText('Alerón trasero excede tolerancia.')).toBeInTheDocument()
  })

  it('permite a la escudería alternar la vista Mis Autos y ver sus observaciones', async () => {
    mockUseSession.mockReturnValue({ data: { user: { role: 'team_staff' } } })
    mockFetchOnce(jsonResponse([mockControl]))
    renderWithQuery(<TechnicalControlsSection />)

    const mineBtn = await screen.findByRole('button', { name: 'Mis Autos' })
    mockFetchOnce(jsonResponse([]))
    fireEvent.click(mineBtn)

    expect(
      await screen.findByText('Tu escudería no posee controles técnicos registrados.'),
    ).toBeInTheDocument()
  })

  it('abre el diálogo de nuevo control al pulsar el botón', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TechnicalControlsSection />)

    const btn = await screen.findByRole('button', { name: '+ Nuevo control técnico' })
    fireEvent.click(btn)

    expect(screen.getByText('Registrar nuevo control técnico')).toBeInTheDocument()
  })
})
