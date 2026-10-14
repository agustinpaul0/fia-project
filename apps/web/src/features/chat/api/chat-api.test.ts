import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { fetchConversationsApi, fetchMessagesApi, registerKeysApi } from './chat-api'

describe('chat-api', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('llama correctamente a los endpoints de la API de chat', async () => {
    mockFetchOnce(
      jsonResponse({ ecdhPublicKey: 'pub-ecdh-12345', ecdsaPublicKey: 'pub-ecdsa-12345' }),
    )
    const resKeys = await registerKeysApi({
      ecdhPublicKey: 'pub-ecdh-12345',
      ecdsaPublicKey: 'pub-ecdsa-12345',
    })
    expect(resKeys.ecdhPublicKey).toBe('pub-ecdh-12345')

    mockFetchOnce(jsonResponse([]))
    const resConv = await fetchConversationsApi()
    expect(resConv).toEqual([])

    mockFetchOnce(jsonResponse([]))
    const resMsg = await fetchMessagesApi('00000000-0000-4000-8000-000000000001')
    expect(resMsg).toEqual([])
  })
})
