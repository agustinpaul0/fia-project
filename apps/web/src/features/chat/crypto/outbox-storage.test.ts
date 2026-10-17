import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { createMemoryOutbox, indexedDbOutbox, type OutboxStorage } from './outbox-storage'

const BODY = { encryptedContent: 'cifrado', iv: 'iv-de-prueba', signature: 'firma-de-prueba' }
const item = (id: string, conversationId: string, createdAt: string) => ({
  id,
  conversationId,
  body: BODY,
  createdAt,
})

describe.each<[string, OutboxStorage]>([
  ['IndexedDB', indexedDbOutbox],
  ['memoria', createMemoryOutbox()],
])('bandeja de salida en %s', (_name, storage) => {
  it('guarda los pendientes por conversación, en orden, y los borra al enviarse', async () => {
    await storage.add(item('b', 'conv-1', '2026-10-17T10:00:02.000Z'))
    await storage.add(item('a', 'conv-1', '2026-10-17T10:00:01.000Z'))
    await storage.add(item('c', 'conv-2', '2026-10-17T10:00:00.000Z'))
    expect((await storage.list('conv-1')).map((i) => i.id)).toEqual(['a', 'b'])
    expect(await storage.list('conv-1')).toContainEqual(
      item('a', 'conv-1', '2026-10-17T10:00:01.000Z'),
    )
    await storage.remove('a')
    expect((await storage.list('conv-1')).map((i) => i.id)).toEqual(['b'])
    expect((await storage.list('conv-2')).map((i) => i.id)).toEqual(['c'])
    expect(await storage.list('otra')).toEqual([])
  })
})
