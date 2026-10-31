import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aDriverAccount, publicDriversResponse, SAINZ } from '@/testing/driver-account-builders'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { DriverAccountsSection } from './driver-accounts-section'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const ACTIVE = aDriverAccount()
const INACTIVE = aDriverAccount({
  id: '00000000-0000-4000-9000-000000000002',
  driverName: 'Lewis Hamilton',
  isActive: false,
  deactivatedAt: '2026-02-01T00:00:00.000Z',
})

describe('DriverAccountsSection (US-27)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista las cuentas con insignia oficial y marca las inactivas', async () => {
    mockFetchRoutes({
      'GET /driver-accounts': () => jsonResponse([ACTIVE, INACTIVE]),
      'GET /team-drivers/public': () => jsonResponse([]),
    })
    renderWithQuery(<DriverAccountsSection />)
    const row = (await screen.findByText('Lewis Hamilton')).closest('tr')
    expect(row && within(row).getByText('Inactiva')).toBeInTheDocument()
    expect(row && within(row).queryByRole('button', { name: 'Dar de baja' })).toBeNull()
    expect(screen.getAllByText(/Piloto oficial/)).toHaveLength(2)
  })

  it('el alta sólo ofrece pilotos sin cuenta y envía los datos', async () => {
    const calls = mockFetchRoutes({
      'GET /driver-accounts': () => jsonResponse([ACTIVE]),
      'GET /team-drivers/public': publicDriversResponse,
      'POST /driver-accounts': () => jsonResponse(aDriverAccount({ driverId: SAINZ.id }), 201),
    })
    renderWithQuery(<DriverAccountsSection />)
    fireEvent.click(await screen.findByRole('button', { name: '+ Nueva cuenta' }))
    const select = screen.getByLabelText('Piloto')
    await waitFor(() => expect(within(select).getAllByRole('option')).toHaveLength(2))
    fireEvent.change(select, { target: { value: SAINZ.id } })
    fireEvent.change(screen.getByLabelText('Nombre visible'), { target: { value: 'Carlos Sainz' } })
    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'sainz@williams.com' } })
    fireEvent.change(screen.getByLabelText('Contraseña inicial'), {
      target: { value: 'Password123!' },
    })
    fireEvent.click(screen.getByRole('button', { name: 'Crear cuenta' }))
    await waitFor(() =>
      expect(calls.find((c) => c.key === 'POST /driver-accounts')?.body).toEqual({
        driverId: SAINZ.id,
        name: 'Carlos Sainz',
        email: 'sainz@williams.com',
        password: 'Password123!',
      }),
    )
  })

  it('pide confirmación y da de baja con la versión vigente', async () => {
    const calls = mockFetchRoutes({
      'GET /driver-accounts': () => jsonResponse([ACTIVE]),
      'GET /team-drivers/public': () => jsonResponse([]),
      [`DELETE /driver-accounts/${ACTIVE.id}?version=1`]: () =>
        jsonResponse({ ...ACTIVE, isActive: false, version: 2 }),
    })
    renderWithQuery(<DriverAccountsSection />)
    fireEvent.click(await screen.findByRole('button', { name: 'Dar de baja' }))
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    await waitFor(() => expect(calls.some((c) => c.key.startsWith('DELETE'))).toBe(true))
  })

  it('modifica el nombre visible enviando la versión', async () => {
    const calls = mockFetchRoutes({
      'GET /driver-accounts': () => jsonResponse([ACTIVE]),
      'GET /team-drivers/public': () => jsonResponse([]),
      [`PUT /driver-accounts/${ACTIVE.id}`]: () => jsonResponse({ ...ACTIVE, version: 2 }),
    })
    renderWithQuery(<DriverAccountsSection />)
    fireEvent.click(await screen.findByRole('button', { name: 'Editar' }))
    fireEvent.change(screen.getByLabelText('Nombre visible'), { target: { value: 'C. Leclerc' } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    await waitFor(() =>
      expect(calls.find((c) => c.key.startsWith('PUT'))?.body).toEqual({
        name: 'C. Leclerc',
        version: 1,
      }),
    )
  })
})
