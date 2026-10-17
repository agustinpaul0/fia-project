import type { CreateEncryptedMessageBody } from '@fia/shared/contracts'
import { isAppError } from '@fia/shared/domain'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useCallback, useEffect } from 'react'
import { CHAT_QUERY_KEYS } from '../api/chat-api'
import { indexedDbOutbox, type OutboxItem, type OutboxStorage } from '../crypto/outbox-storage'

type Send = (body: CreateEncryptedMessageBody) => Promise<unknown>

export const isNetworkError = (error: unknown): boolean =>
  isAppError(error) && error.code === 'NETWORK_ERROR'

export const flushOutbox = async (params: {
  readonly storage: OutboxStorage
  readonly conversationId: string
  readonly send: Send
}): Promise<void> => {
  for (const item of await params.storage.list(params.conversationId)) {
    const failure = await params.send(item.body).then(
      () => null,
      (error: unknown) => error,
    )
    if (failure !== null && isNetworkError(failure)) {
      return
    }
    await params.storage.remove(item.id)
  }
}

export type Outbox = {
  readonly pending: readonly OutboxItem[]
  readonly enqueue: (body: CreateEncryptedMessageBody) => Promise<void>
}

export const useOutbox = (
  conversationId: string,
  send: Send,
  storage: OutboxStorage = indexedDbOutbox,
): Outbox => {
  const qc = useQueryClient()
  const key = ['chat', 'outbox', conversationId] as const
  const { data: pending = [] } = useQuery({
    queryKey: key,
    queryFn: () => storage.list(conversationId),
    enabled: conversationId !== '',
  })
  const refresh = useCallback(async (): Promise<void> => {
    await qc.invalidateQueries({ queryKey: ['chat', 'outbox', conversationId] })
    await qc.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) })
  }, [qc, conversationId])
  useEffect(() => {
    if (conversationId === '') {
      return
    }
    const flush = (): void => {
      void flushOutbox({ storage, conversationId, send })
        .then(refresh)
        .catch(() => undefined)
    }
    flush()
    window.addEventListener('online', flush)
    return () => window.removeEventListener('online', flush)
  }, [storage, conversationId, send, refresh])
  const enqueue = async (body: CreateEncryptedMessageBody): Promise<void> => {
    const item = {
      id: crypto.randomUUID(),
      conversationId,
      body,
      createdAt: new Date().toISOString(),
    }
    await storage.add(item)
    await refresh()
  }
  return { pending, enqueue }
}
