import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { API_DOWN_MESSAGE, HealthBadge } from './health-badge'

describe('HealthBadge', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('no muestra nada mientras verifica', () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    const { container } = renderWithQuery(<HealthBadge />)
    expect(container).toBeEmptyDOMElement()
  })

  it('no molesta cuando la API responde bien', async () => {
    mockFetchOnce(jsonResponse({ status: 'ok', database: 'up' }))
    const { container } = renderWithQuery(<HealthBadge />)
    await vi.waitFor(() => expect(globalThis.fetch).toHaveBeenCalled())
    await new Promise((resolve) => setTimeout(resolve, 20))
    expect(container).toBeEmptyDOMElement()
  })

  it.each([
    ['la base está caída', jsonResponse({ status: 'ok', database: 'down' })],
    ['no hay conexión', new TypeError('Failed to fetch')],
  ])('avisa que la API no está disponible si %s', async (_caso, response) => {
    mockFetchOnce(response)
    renderWithQuery(<HealthBadge />)
    expect(await screen.findByRole('alert')).toHaveTextContent(API_DOWN_MESSAGE)
  })
})
