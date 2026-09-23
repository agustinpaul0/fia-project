import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { HealthBadge } from './health-badge'

describe('HealthBadge', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('indica que está verificando mientras carga', () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    renderWithQuery(<HealthBadge />)
    expect(screen.getByText('Verificando servidor…')).toBeInTheDocument()
  })

  it('indica servidor en línea', async () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    renderWithQuery(<HealthBadge />)
    expect(await screen.findByText('Servidor en línea')).toBeInTheDocument()
  })

  it.each([
    ['la base está caída', jsonResponse({ status: 'ok', database: 'down' })],
    ['no hay conexión', new TypeError('Failed to fetch')],
  ])('indica servidor no disponible si %s', async (_caso, response) => {
    mockFetchOnce(response)
    renderWithQuery(<HealthBadge />)
    expect(await screen.findByText('Servidor no disponible')).toBeInTheDocument()
  })
})
