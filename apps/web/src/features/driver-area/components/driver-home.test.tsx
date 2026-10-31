import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aDriverAccount } from '@/testing/driver-account-builders'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithRouter } from '@/testing/render-with-router'
import { DriverHome } from './driver-home'

const ACCOUNT = aDriverAccount()

describe('DriverHome (área del piloto, US-29)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra el perfil oficial y pide sólo las sanciones del piloto', async () => {
    const calls = mockFetchRoutes({
      'GET /driver-accounts/me': () => jsonResponse(ACCOUNT),
      [`GET /penalties?driverId=${ACCOUNT.driverId}`]: () => jsonResponse([]),
    })
    renderWithRouter(<DriverHome />)
    expect(await screen.findByRole('heading', { name: 'Charles Leclerc' })).toBeInTheDocument()
    expect(screen.getByText(/Piloto oficial/)).toBeInTheDocument()
    expect(
      await screen.findByText('No tenés sanciones registradas en los últimos 5 años.'),
    ).toBeInTheDocument()
    expect(calls.map((c) => c.key)).toContain(`GET /penalties?driverId=${ACCOUNT.driverId}`)
  })
})
