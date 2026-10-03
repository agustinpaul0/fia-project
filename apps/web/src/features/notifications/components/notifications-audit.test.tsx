import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aScoreNotification, NOTIFICATION_ID } from '@/testing/notification-builders'
import { renderWithQuery } from '@/testing/render-with-query'
import { NO_NOTIFICATIONS_MESSAGE, NotificationsAudit } from './notifications-audit'
import { NO_AUDIT_MATCHES } from './notifications-audit-table'

const AUDIT = 'GET /notifications/audit' as const

describe('NotificationsAudit', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra quién confirmó y cuándo en hora argentina, y las pendientes', async () => {
    const confirmed = aScoreNotification({
      status: 'confirmed',
      confirmedAt: '2025-05-26T13:30:00.000Z',
      confirmedByName: 'Ana Pérez',
    })
    const pending = aScoreNotification({
      id: NOTIFICATION_ID.replace('501', '503'),
      teamName: 'Ferrari',
    })
    mockFetchRoutes({ [AUDIT]: () => jsonResponse([confirmed, pending]) })
    renderWithQuery(<NotificationsAudit />)
    const rows = await screen.findAllByRole('row')
    expect(rows[1]).toHaveTextContent('McLaren')
    expect(rows[1]).toHaveTextContent('Confirmada')
    expect(rows[1]).toHaveTextContent('Ana Pérez26/5/25, 10:30')
    expect(rows[2]).toHaveTextContent('Pendiente')
    expect(rows[2]).toHaveTextContent('Notificación enviada')
    expect(
      screen.getByText('Mostrando 2 de 2 | 1 confirmadas (50%) | 1 pendientes (50%)'),
    ).toBeInTheDocument()
  })

  it('filtra por estado y por texto', async () => {
    const confirmed = aScoreNotification({
      status: 'confirmed',
      confirmedAt: '2025-05-26T13:30:00.000Z',
      confirmedByName: 'Ana Pérez',
    })
    const pending = aScoreNotification({
      id: NOTIFICATION_ID.replace('501', '503'),
      teamName: 'Ferrari',
    })
    mockFetchRoutes({ [AUDIT]: () => jsonResponse([confirmed, pending]) })
    renderWithQuery(<NotificationsAudit />)
    fireEvent.click(await screen.findByRole('button', { name: 'Pendientes (1)' }))
    expect(screen.getAllByRole('row')).toHaveLength(2)
    expect(screen.getAllByRole('row')[1]).toHaveTextContent('Ferrari')
    fireEvent.click(screen.getByRole('button', { name: 'Todas' }))
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'mclaren' } })
    expect(screen.getAllByRole('row')).toHaveLength(2)
    fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'zzz' } })
    expect(screen.getByText(NO_AUDIT_MATCHES)).toBeInTheDocument()
  })

  it('indica cuando todavía no hay puntajes publicados', async () => {
    mockFetchRoutes({ [AUDIT]: () => jsonResponse([]) })
    renderWithQuery(<NotificationsAudit />)
    expect(await screen.findByText(NO_NOTIFICATIONS_MESSAGE)).toBeInTheDocument()
  })
})
