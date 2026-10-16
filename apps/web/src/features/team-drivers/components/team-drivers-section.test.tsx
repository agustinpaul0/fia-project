import type { Driver } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { TeamDriversSection } from './team-drivers-section'

const mockDriver: Driver = {
  id: '00000000-0000-4000-8000-000000000001',
  firstName: 'Charles',
  lastName: 'Leclerc',
  code: 'LEC',
  number: 16,
  country: 'Mónaco',
  license: 'FIA-16-LEC',
  teamId: '00000000-0000-4000-8000-000000000002',
  role: 'main',
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
}

describe('TeamDriversSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra estado vacío cuando no hay pilotos inscriptos', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TeamDriversSection />)

    expect(
      await screen.findByText('No hay pilotos inscriptos en tu escudería.'),
    ).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '+ Inscribir piloto' })).toBeInTheDocument()
  })

  it('muestra la nómina de pilotos con su dorsal, código y condición', async () => {
    mockFetchOnce(jsonResponse([mockDriver]))
    renderWithQuery(<TeamDriversSection />)

    expect(await screen.findByText('Charles Leclerc')).toBeInTheDocument()
    expect(screen.getByText('#16')).toBeInTheDocument()
    expect(screen.getByText('LEC')).toBeInTheDocument()
    expect(screen.getByText('Titular')).toBeInTheDocument()
  })

  it('abre el diálogo de inscripción al pulsar el botón', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TeamDriversSection />)

    const btn = await screen.findByRole('button', { name: '+ Inscribir piloto' })
    fireEvent.click(btn)

    expect(screen.getByText('Inscribir nuevo piloto')).toBeInTheDocument()
  })
})
