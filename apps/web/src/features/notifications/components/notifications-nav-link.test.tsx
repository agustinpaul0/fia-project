import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { aScoreNotification } from '@/testing/notification-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { NotificationsNavLink } from './notifications-nav-link'

describe('NotificationsNavLink', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra la cantidad de pendientes y enlaza a la bandeja', async () => {
    mockFetchRoutes({ 'GET /notifications': () => jsonResponse([aScoreNotification()]) })
    renderWithRouter(<NotificationsNavLink />)
    expect(await screen.findByLabelText('1 pendientes')).toBeInTheDocument()
    expect(screen.getByRole('link')).toHaveAttribute('href', '/notifications')
  })

  it('no muestra contador si no hay pendientes', async () => {
    mockFetchRoutes({ 'GET /notifications': () => jsonResponse([]) })
    renderWithRouter(<NotificationsNavLink />)
    expect(await screen.findByRole('link')).toHaveTextContent('Notificaciones')
    expect(screen.queryByLabelText(/pendientes/)).not.toBeInTheDocument()
  })
})
