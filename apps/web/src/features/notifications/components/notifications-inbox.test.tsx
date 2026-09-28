import { fireEvent, screen, waitFor } from '@testing-library/react'
import { toast } from 'sonner'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aScoreNotification, NOTIFICATION_ID } from '@/testing/notification-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { CONFIRMED_MESSAGE } from '../hooks/use-notifications'
import { NO_PENDING_MESSAGE, NotificationsInbox } from './notifications-inbox'

const LIST = 'GET /notifications' as const
const CONFIRM = `POST /notifications/${NOTIFICATION_ID}/confirm` as const

describe('NotificationsInbox', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('muestra cada puntaje pendiente con la carrera, la escudería y los puntos', async () => {
    const corrected = aScoreNotification({
      id: NOTIFICATION_ID.replace('501', '502'),
      resultsRevision: 2,
    })
    mockFetchRoutes({ [LIST]: () => jsonResponse([aScoreNotification(), corrected]) })
    renderWithQuery(<NotificationsInbox />)
    expect(await screen.findByText('Puntaje publicado')).toBeInTheDocument()
    expect(screen.getByText('Puntaje corregido (revisión 2)')).toBeInTheDocument()
    expect(screen.getAllByText(/McLaren sumó 43 puntos/)).toHaveLength(2)
  })

  it('confirma con un click, avisa y la notificación desaparece', async () => {
    const success = vi.spyOn(toast, 'success').mockReturnValue(1)
    let confirmed = false
    const calls = mockFetchRoutes({
      [LIST]: () => jsonResponse(confirmed ? [] : [aScoreNotification()]),
      [CONFIRM]: () => {
        confirmed = true
        return jsonResponse(aScoreNotification({ status: 'confirmed' }))
      },
    })
    renderWithQuery(<NotificationsInbox />)
    fireEvent.click(await screen.findByRole('button', { name: 'Confirmar recepción' }))
    expect(await screen.findByText(NO_PENDING_MESSAGE)).toBeInTheDocument()
    expect(success).toHaveBeenCalledWith(CONFIRMED_MESSAGE)
    expect(calls.filter((c) => c.key === CONFIRM)).toHaveLength(1)
  })

  it('si otra persona ya confirmó, recarga la bandeja', async () => {
    const error = { code: 'NOTIFICATION_ALREADY_CONFIRMED', message: 'x', fields: null }
    const calls = mockFetchRoutes({
      [LIST]: () => jsonResponse([aScoreNotification()]),
      [CONFIRM]: () => jsonResponse({ error }, 409),
    })
    renderWithQuery(<NotificationsInbox />)
    fireEvent.click(await screen.findByRole('button', { name: 'Confirmar recepción' }))
    await waitFor(() => expect(calls.filter((c) => c.key === LIST)).toHaveLength(2))
  })

  it('indica cuando no hay pendientes', async () => {
    mockFetchRoutes({ [LIST]: () => jsonResponse([]) })
    renderWithQuery(<NotificationsInbox />)
    expect(await screen.findByText(NO_PENDING_MESSAGE)).toBeInTheDocument()
  })
})
