import type { TechnicalControl } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { TechnicalControlsSection } from './technical-controls-section'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(() => ({ data: { user: { role: 'fia_admin' } } })),
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
  })

  it('muestra estado vacío cuando no hay controles registrados', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TechnicalControlsSection />)

    expect(
      await screen.findByText(
        'No se encontraron controles técnicos registrados para los filtros aplicados.',
      ),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Nuevo control técnico' })).toBeInTheDocument()
  })

  it('muestra el listado de controles con datos requeridos', async () => {
    mockFetchOnce(jsonResponse([mockControl]))
    renderWithQuery(<TechnicalControlsSection />)

    expect(await screen.findByText(/Ferrari/)).toBeInTheDocument()
    expect(screen.getByText('Auto #16')).toBeInTheDocument()
    expect(screen.getByText('Charles Leclerc')).toBeInTheDocument()
    expect(screen.getAllByText('Pesaje').length).toBeGreaterThanOrEqual(1)
    expect(screen.getAllByText('Aprobado').length).toBeGreaterThanOrEqual(1)
  })

  it('abre el diálogo de nuevo control al pulsar el botón', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TechnicalControlsSection />)

    const btn = await screen.findByRole('button', { name: '+ Nuevo control técnico' })
    fireEvent.click(btn)

    expect(screen.getByText('Registrar nuevo control técnico')).toBeInTheDocument()
  })
})
