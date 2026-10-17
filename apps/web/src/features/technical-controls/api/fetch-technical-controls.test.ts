import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { fetchTechnicalControls } from './fetch-technical-controls'

describe('fetchTechnicalControls', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('realiza petición sin parámetros de búsqueda', async () => {
    mockFetchOnce(jsonResponse([]))
    const result = await fetchTechnicalControls()
    expect(result).toEqual([])
  })

  it('construye la query string con todos los parámetros', async () => {
    mockFetchOnce(jsonResponse([]))
    const result = await fetchTechnicalControls({
      season: 2026,
      teamId: '00000000-0000-4000-8000-000000000010',
      controlType: 'weight',
      status: 'passed',
    })
    expect(result).toEqual([])
  })
})
