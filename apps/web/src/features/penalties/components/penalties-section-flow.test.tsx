import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aPenalty } from '@/testing/penalty-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { PenaltiesSection } from './penalties-section'

const session = vi.hoisted(() => ({ role: 'fia_admin' }))
vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: { user: { role: session.role } } }),
}))
const toastSuccess = vi.fn()
vi.mock('sonner', () => ({ toast: { success: (msg: string) => toastSuccess(msg) } }))

const FERRARI = aPenalty().teamId
const CURRENT = `GET /penalties?season=${new Date().getFullYear()}` as const

describe('PenaltiesSection (flujo)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    session.role = 'fia_admin'
  })

  it('arranca en la temporada actual y pide al servidor la temporada y el tipo elegidos (US-16)', async () => {
    const calls = mockFetchRoutes({
      [CURRENT]: () => jsonResponse([aPenalty()]),
      'GET /penalties?season=2024&type=fine': () => jsonResponse([]),
    })
    renderWithQuery(<PenaltiesSection />)
    await screen.findByRole('cell', { name: /Charles Leclerc/ })
    fireEvent.change(screen.getByLabelText('Temporada:'), { target: { value: '2024' } })
    fireEvent.change(screen.getByLabelText('Tipo:'), { target: { value: 'fine' } })
    await waitFor(() =>
      expect(calls.map((c) => c.key)).toContain('GET /penalties?season=2024&type=fine'),
    )
  })

  it('el público ve el listado pero no puede cargar sanciones', async () => {
    session.role = 'public'
    mockFetchRoutes({ [CURRENT]: () => jsonResponse([aPenalty()]) })
    renderWithQuery(<PenaltiesSection />)
    expect(await screen.findByRole('cell', { name: /Charles Leclerc/ })).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: '+ Nueva sanción' })).not.toBeInTheDocument()
  })

  it('la FIA registra una sanción y el listado se actualiza', async () => {
    let saved = false
    const calls = mockFetchRoutes({
      [CURRENT]: () => jsonResponse(saved ? [aPenalty({ driverId: null, driverName: null })] : []),
      'GET /teams': () => jsonResponse([{ id: FERRARI, name: 'Ferrari' }]),
      [`GET /teams/${FERRARI}/drivers`]: () => jsonResponse([]),
      'POST /penalties': () => {
        saved = true
        return jsonResponse(aPenalty(), 201)
      },
    })
    renderWithQuery(<PenaltiesSection />)
    fireEvent.click(await screen.findByRole('button', { name: '+ Nueva sanción' }))
    await screen.findByRole('option', { name: 'Ferrari' })
    fireEvent.change(screen.getByLabelText('Escudería'), { target: { value: FERRARI } })
    fireEvent.change(screen.getByLabelText('Sanción aplicada'), { target: { value: 'Multa' } })
    fireEvent.change(screen.getByLabelText(/Motivo/), { target: { value: 'Motivo válido.' } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    expect(await screen.findByText('Ferrari (Escudería)')).toBeInTheDocument()
    expect(calls.find((c) => c.key === 'POST /penalties')?.body).toMatchObject({ teamId: FERRARI })
    expect(toastSuccess).toHaveBeenCalledWith('Sanción registrada exitosamente.')
  })
})
