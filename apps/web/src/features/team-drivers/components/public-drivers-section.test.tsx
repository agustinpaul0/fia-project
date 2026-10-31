import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aDriver } from '@/testing/driver-builders'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { PublicDriversSection } from './public-drivers-section'

describe('PublicDriversSection (US-11 y US-27)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra la nómina de sólo lectura con condición e insignia oficial', async () => {
    mockFetchRoutes({
      'GET /team-drivers/public': () =>
        jsonResponse([
          { ...aDriver(), teamName: 'Ferrari', hasOfficialAccount: true },
          {
            ...aDriver({
              id: '00000000-0000-4000-8000-000000000009',
              firstName: 'Oliver',
              lastName: 'Bearman',
              code: 'BEA',
              role: 'reserve',
            }),
            teamName: 'Ferrari',
            hasOfficialAccount: false,
          },
        ]),
    })
    renderWithQuery(<PublicDriversSection />)
    expect(await screen.findByText('Charles Leclerc')).toBeInTheDocument()
    expect(screen.getByText('Titular')).toBeInTheDocument()
    expect(screen.getByText('Suplente')).toBeInTheDocument()
    expect(screen.getAllByText(/Piloto oficial/)).toHaveLength(1)
    expect(screen.queryByRole('button')).toBeNull()
  })
})
