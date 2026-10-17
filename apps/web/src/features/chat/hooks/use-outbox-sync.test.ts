import { AppError } from '@fia/shared/domain'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryOutbox } from '../crypto/outbox-storage'
import { flushAllOutboxes } from './use-outbox-sync'

const body = { encryptedContent: 'c', iv: 'iv-de-prueba', signature: 'firma-de-prueba' }

describe('flushAllOutboxes', () => {
  it('vacía las bandejas de todas las conversaciones', async () => {
    const storage = createMemoryOutbox()
    await storage.add({
      id: 'a',
      conversationId: 'c1',
      body,
      createdAt: '2026-10-17T10:00:00.000Z',
    })
    await storage.add({
      id: 'b',
      conversationId: 'c2',
      body,
      createdAt: '2026-10-17T10:00:01.000Z',
    })
    const sendTo = vi.fn().mockResolvedValue(undefined)
    await flushAllOutboxes(storage, sendTo)
    expect(sendTo.mock.calls.map(([conv]) => conv)).toEqual(['c1', 'c2'])
    expect(await storage.conversationsWithPending()).toEqual([])
  })

  it('si no hay red corta y deja todo para el próximo intento', async () => {
    const storage = createMemoryOutbox()
    await storage.add({
      id: 'a',
      conversationId: 'c1',
      body,
      createdAt: '2026-10-17T10:00:00.000Z',
    })
    await storage.add({
      id: 'b',
      conversationId: 'c2',
      body,
      createdAt: '2026-10-17T10:00:01.000Z',
    })
    const sendTo = vi.fn().mockRejectedValue(new AppError('NETWORK_ERROR'))
    await flushAllOutboxes(storage, sendTo)
    expect(sendTo).toHaveBeenCalledTimes(1)
    expect(await storage.conversationsWithPending()).toEqual(['c1', 'c2'])
  })
})
