import type { CreateEncryptedMessageBody } from '@fia/shared/contracts'
import { useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { sendMessageApi } from '../api/chat-api'
import { indexedDbOutbox, type OutboxStorage } from '../crypto/outbox-storage'
import { flushOutbox } from './use-outbox'

export const OUTBOX_RETRY_MS = 30_000

type SendTo = (conversationId: string, body: CreateEncryptedMessageBody) => Promise<unknown>

export const flushAllOutboxes = async (storage: OutboxStorage, sendTo: SendTo): Promise<void> => {
  for (const conversationId of await storage.conversationsWithPending()) {
    const send = (body: CreateEncryptedMessageBody) => sendTo(conversationId, body)
    if (!(await flushOutbox({ storage, conversationId, send }))) {
      return
    }
  }
}

export const useOutboxSync = (enabled: boolean, storage: OutboxStorage = indexedDbOutbox): void => {
  const qc = useQueryClient()
  useEffect(() => {
    if (!enabled) {
      return
    }
    const sync = (): void => {
      void flushAllOutboxes(storage, sendMessageApi)
        .then(() => qc.invalidateQueries({ queryKey: ['chat'] }))
        .catch(() => undefined)
    }
    sync()
    window.addEventListener('online', sync)
    const timer = window.setInterval(sync, OUTBOX_RETRY_MS)
    return () => {
      window.removeEventListener('online', sync)
      window.clearInterval(timer)
    }
  }, [enabled, storage, qc])
}
