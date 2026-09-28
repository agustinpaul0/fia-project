import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { fetchTeamOptions } from './fetch-team-options'

describe('fetchTeamOptions', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('obtiene la lista de escuderías y valida el contrato', async () => {
    const teams = [
      { id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' },
      { id: '00000000-0000-4000-8000-000000000002', name: 'McLaren' },
    ]
    mockFetchOnce(jsonResponse(teams))
    const result = await fetchTeamOptions()
    expect(result).toEqual(teams)
  })
})
