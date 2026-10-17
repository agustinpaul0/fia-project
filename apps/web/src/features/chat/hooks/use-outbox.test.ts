import { AppError } from '@fia/shared/domain'
import { describe, expect, it, vi } from 'vitest'
import { createMemoryOutbox } from '../crypto/outbox-storage'
import { flushOutbox, isNetworkError } from './use-outbox'

const body = (n: number) => ({
  encryptedContent: `c${n}`,
  iv: 'iv-de-prueba',
  signature: 'firma-de-prueba',
})

const outboxWith = async (count: number) => {
  const storage = createMemoryOutbox()
  for (let n = 1; n <= count; n++) {
    await storage.add({
      id: `m${n}`,
      conversationId: 'conv',
      body: body(n),
      createdAt: `2026-10-17T10:00:0${n}.000Z`,
    })
  }
  return storage
}

describe('flushOutbox', () => {
  it('envía los pendientes en orden y los saca de la bandeja', async () => {
    const storage = await outboxWith(2)
    const send = vi.fn().mockResolvedValue(undefined)
    await flushOutbox({ storage, conversationId: 'conv', send })
    expect(send.mock.calls.map(([b]) => b.encryptedContent)).toEqual(['c1', 'c2'])
    expect(await storage.list('conv')).toEqual([])
  })

  it('si sigue sin conexión se detiene y conserva lo que falta', async () => {
    const storage = await outboxWith(3)
    const send = vi
      .fn()
      .mockResolvedValueOnce(undefined)
      .mockRejectedValue(new AppError('NETWORK_ERROR'))
    await flushOutbox({ storage, conversationId: 'conv', send })
    expect(send).toHaveBeenCalledTimes(2)
    expect((await storage.list('conv')).map((i) => i.id)).toEqual(['m2', 'm3'])
  })

  it('descarta un pendiente que el servidor rechaza por otro motivo', async () => {
    const storage = await outboxWith(2)
    const send = vi
      .fn()
      .mockRejectedValueOnce(new AppError('CONVERSATION_NOT_FOUND'))
      .mockResolvedValue(undefined)
    await flushOutbox({ storage, conversationId: 'conv', send })
    expect(await storage.list('conv')).toEqual([])
  })

  it('reconoce sólo los errores de red', () => {
    expect(isNetworkError(new AppError('NETWORK_ERROR'))).toBe(true)
    expect(isNetworkError(new AppError('INTERNAL_ERROR'))).toBe(false)
    expect(isNetworkError(new Error('x'))).toBe(false)
  })
})
