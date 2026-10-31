import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { aTechnicalControl } from '@/testing/technical-control-builders'
import { TechnicalControlsSection } from './technical-controls-section'

vi.mock('@/lib/auth-client', () => ({ useSession: () => ({ data: null }) }))

describe('TechnicalControlsSection — identificadores (US-3)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('filtra por escudería y por piloto sobre el listado', async () => {
    const mclaren = aTechnicalControl({
      driverId: '00000000-0000-4000-8000-000000000020',
      driverName: 'Lando Norris',
    })
    const ferrari = aTechnicalControl({
      id: '00000000-0000-4000-8000-000000000002',
      teamId: '00000000-0000-4000-8000-000000000011',
      teamName: 'Ferrari',
    })
    mockFetchOnce(jsonResponse([mclaren, ferrari]))
    renderWithQuery(<TechnicalControlsSection />)
    fireEvent.change(await screen.findByLabelText('Escudería:'), {
      target: { value: ferrari.teamId },
    })
    expect(screen.getByText('Total de controles registrados: 1')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Piloto:'), {
      target: { value: mclaren.driverId ?? '' },
    })
    expect(screen.getByText('Sin resultados.')).toBeInTheDocument()
  })
})
