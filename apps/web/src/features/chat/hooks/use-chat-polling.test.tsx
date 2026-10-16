import { QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CONVERSATION } from '@/testing/fake-chat-server'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { createTestQueryClient } from '@/testing/render-with-query'
import {
  CONVERSATIONS_POLL_MS,
  MESSAGES_POLL_MS,
  useConversationMessages,
  useConversations,
} from './use-chat'

const wrapper = ({ children }: { readonly children: ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>{children}</QueryClientProvider>
)

const MESSAGES = `GET /chat/conversations/${CONVERSATION.id}/messages` as const

describe('Actualización periódica del chat', () => {
  afterEach(() => {
    vi.useRealTimers()
    vi.unstubAllGlobals()
  })

  it('vuelve a pedir los mensajes de la conversación abierta cada 3 segundos', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const calls = mockFetchRoutes({ [MESSAGES]: () => jsonResponse([]) })
    renderHook(() => useConversationMessages(CONVERSATION.id), { wrapper })
    await waitFor(() => expect(calls).toHaveLength(1))
    await vi.advanceTimersByTimeAsync(MESSAGES_POLL_MS)
    await waitFor(() => expect(calls).toHaveLength(2))
  })

  it('no consulta mensajes si no hay conversación elegida', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const calls = mockFetchRoutes({})
    renderHook(() => useConversationMessages(null), { wrapper })
    await vi.advanceTimersByTimeAsync(MESSAGES_POLL_MS * 2)
    expect(calls).toHaveLength(0)
  })

  it('refresca la lista de conversaciones cada 10 segundos', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true })
    const calls = mockFetchRoutes({ 'GET /chat/conversations': () => jsonResponse([]) })
    renderHook(() => useConversations(), { wrapper })
    await waitFor(() => expect(calls).toHaveLength(1))
    await vi.advanceTimersByTimeAsync(CONVERSATIONS_POLL_MS)
    await waitFor(() => expect(calls).toHaveLength(2))
  })
})
