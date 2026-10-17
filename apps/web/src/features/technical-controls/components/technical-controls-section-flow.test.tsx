import { fireEvent, screen, waitFor, within } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { aTechnicalControl } from '@/testing/technical-control-builders'
import { TechnicalControlsSection } from './technical-controls-section'

const session = vi.hoisted(() => ({ role: 'fia_admin' }))
vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: { user: { role: session.role } } }),
}))
const toastSuccess = vi.fn()
vi.mock('sonner', () => ({ toast: { success: (msg: string) => toastSuccess(msg) } }))

const TEAM = aTechnicalControl().teamId

describe('TechnicalControlsSection (flujo)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    session.role = 'fia_admin'
  })

  it('pide al servidor los filtros elegidos', async () => {
    const calls = mockFetchRoutes({
      'GET /technical-controls': () => jsonResponse([aTechnicalControl()]),
      'GET /technical-controls?season=2025&controlType=safety&status=passed': () =>
        jsonResponse([]),
    })
    renderWithQuery(<TechnicalControlsSection />)
    await screen.findByText('Auto #4')
    fireEvent.change(screen.getByLabelText(/Temporada/), { target: { value: '2025' } })
    fireEvent.change(screen.getByLabelText(/Tipo/), { target: { value: 'safety' } })
    fireEvent.change(screen.getByLabelText('Resultado:'), { target: { value: 'passed' } })
    await waitFor(() =>
      expect(calls.map((c) => c.key)).toContain(
        'GET /technical-controls?season=2025&controlType=safety&status=passed',
      ),
    )
  })

  it('el público consulta sin poder cargar controles', async () => {
    session.role = 'public'
    mockFetchRoutes({ 'GET /technical-controls': () => jsonResponse([aTechnicalControl()]) })
    renderWithQuery(<TechnicalControlsSection />)
    expect(await screen.findByText('Auto #4')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Nuevo control/ })).not.toBeInTheDocument()
  })

  it('la FIA registra un control y el listado se actualiza', async () => {
    let saved = false
    const calls = mockFetchRoutes({
      'GET /technical-controls': () =>
        jsonResponse(saved ? [aTechnicalControl({ carNumber: 16 })] : []),
      'GET /teams': () => jsonResponse([{ id: TEAM, name: 'McLaren' }]),
      'POST /technical-controls': () => {
        saved = true
        return jsonResponse(aTechnicalControl({ carNumber: 16 }), 201)
      },
    })
    renderWithQuery(<TechnicalControlsSection />)
    fireEvent.click(await screen.findByRole('button', { name: /Nuevo control/ }))
    const dialog = await screen.findByRole('dialog')
    await within(dialog).findByRole('option', { name: 'McLaren' })
    const values: Record<string, string> = {
      Escudería: TEAM,
      'Número de auto': '16',
      'Fecha y hora del control': '2026-10-16T10:00',
      'Vigente hasta': '2026-10-17T10:00',
    }
    for (const [label, value] of Object.entries(values)) {
      fireEvent.change(within(dialog).getByLabelText(label), { target: { value } })
    }
    fireEvent.click(within(dialog).getByRole('button', { name: 'Registrar control' }))
    expect(await screen.findByText('Auto #16')).toBeInTheDocument()
    expect(calls.find((c) => c.key === 'POST /technical-controls')?.body).toMatchObject({
      carNumber: 16,
      inspectedAt: '2026-10-16T13:00:00.000Z',
    })
    expect(toastSuccess).toHaveBeenCalled()
  })
})
