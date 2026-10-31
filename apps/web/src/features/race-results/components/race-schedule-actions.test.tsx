import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aRaceSummary } from '@/testing/race-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { CALENDAR_POLL_MS } from '../hooks/use-race-queries'
import { CANCELLED_NOTICE, RaceScheduleActions } from './race-schedule-actions'

vi.mock('sonner', () => ({ toast: { success: vi.fn() } }))

const RACE = aRaceSummary({ date: '2026-06-07T18:00:00.000Z' })
const SILVERSTONE = {
  id: '00000000-0000-4000-8000-0000000000a3',
  name: 'Silverstone',
  country: 'Reino Unido',
}
const CIRCUITS = [{ id: RACE.circuitId, name: RACE.circuitName, country: 'Mónaco' }, SILVERSTONE]

describe('RaceScheduleActions (US-19)', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('la FIA modifica fecha, hora, tipo y circuito; la hora se carga en horario argentino', async () => {
    const calls = mockFetchRoutes({
      'GET /races/circuits': () => jsonResponse(CIRCUITS),
      [`PUT /races/${RACE.id}`]: () => jsonResponse({ ...RACE, status: 'modified', version: 4 }),
    })
    renderWithQuery(<RaceScheduleActions race={RACE} />)
    fireEvent.click(screen.getByRole('button', { name: 'Modificar evento' }))
    expect(screen.getByLabelText('Fecha y hora (Argentina)')).toHaveValue('2026-06-07T15:00')
    await screen.findByRole('option', { name: 'Silverstone (Reino Unido)' })
    fireEvent.change(screen.getByLabelText('Fecha y hora (Argentina)'), {
      target: { value: '2026-06-14T10:30' },
    })
    fireEvent.change(screen.getByLabelText('Tipo'), { target: { value: 'sprint' } })
    fireEvent.change(screen.getByLabelText('Circuito'), { target: { value: SILVERSTONE.id } })
    fireEvent.click(screen.getByRole('button', { name: 'Guardar cambios' }))
    await waitFor(() =>
      expect(calls.find((c) => c.key.startsWith('PUT'))?.body).toEqual({
        name: RACE.name,
        date: '2026-06-14T13:30:00.000Z',
        type: 'sprint',
        circuitId: SILVERSTONE.id,
        version: RACE.version,
      }),
    )
  })

  it('la baja pide confirmación antes de enviarse', async () => {
    const calls = mockFetchRoutes({
      'GET /races/circuits': () => jsonResponse(CIRCUITS),
      [`DELETE /races/${RACE.id}`]: () => jsonResponse({ ...RACE, status: 'cancelled' }),
    })
    renderWithQuery(<RaceScheduleActions race={RACE} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dar de baja' }))
    expect(calls.some((c) => c.key.startsWith('DELETE'))).toBe(false)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    await waitFor(() =>
      expect(calls.find((c) => c.key.startsWith('DELETE'))?.body).toEqual({
        version: RACE.version,
      }),
    )
  })

  it('un evento cancelado ya no ofrece acciones', () => {
    mockFetchRoutes({ 'GET /races/circuits': () => jsonResponse(CIRCUITS) })
    renderWithQuery(<RaceScheduleActions race={{ ...RACE, status: 'cancelled' }} />)
    expect(screen.getByText(CANCELLED_NOTICE)).toBeInTheDocument()
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('el calendario se vuelve a consultar en menos de 10 minutos', () => {
    expect(CALENDAR_POLL_MS).toBeLessThan(10 * 60_000)
  })
})
