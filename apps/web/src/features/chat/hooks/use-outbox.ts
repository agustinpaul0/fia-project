import type { CreateEncryptedMessageBody } from '@fia/shared/contracts'
import { isAppError } from '@fia/shared/domain'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { indexedDbOutbox, type OutboxItem, type OutboxStorage } from '../crypto/outbox-storage'

type Send = (body: CreateEncryptedMessageBody) => Promise<unknown>

export const outboxQueryKey = (conversationId: string) =>
  ['chat', 'outbox', conversationId] as const

export const isNetworkError = (error: unknown): boolean =>
  isAppError(error) && error.code === 'NETWORK_ERROR'

export const flushOutbox = async (params: {
  readonly storage: OutboxStorage
  readonly conversationId: string
  readonly send: Send
}): Promise<boolean> => {
  for (const item of await params.storage.list(params.conversationId)) {
    const failure = await params.send(item.body).then(
      () => null,
      (error: unknown) => error,
    )
    if (failure !== null && isNetworkError(failure)) {
      return false
    }
    await params.storage.remove(item.id)
  }
  return true
}

export type Outbox = {
  readonly pending: readonly OutboxItem[]
  readonly enqueue: (body: CreateEncryptedMessageBody) => Promise<void>
}

export const useOutbox = (
  conversationId: string,
  storage: OutboxStorage = indexedDbOutbox,
): Outbox => {
  const qc = useQueryClient()
  const { data: pending = [] } = useQuery({
    queryKey: outboxQueryKey(conversationId),
    queryFn: () => storage.list(conversationId),
    enabled: conversationId !== '',
  })
  const enqueue = async (body: CreateEncryptedMessageBody): Promise<void> => {
    const createdAt = new Date().toISOString()
    await storage.add({ id: crypto.randomUUID(), conversationId, body, createdAt })
    await qc.invalidateQueries({ queryKey: outboxQueryKey(conversationId) })
  }
  return { pending, enqueue }
}
