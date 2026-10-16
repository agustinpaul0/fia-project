import 'fake-indexeddb/auto'
import { describe, expect, it } from 'vitest'
import { generateE2EKeyPairs } from './e2e-crypto'
import { indexedDbKeyStorage } from './key-storage'

describe('indexedDbKeyStorage', () => {
  it('persiste el par de claves por usuario entre aperturas de la base', async () => {
    const keys = await generateE2EKeyPairs()
    expect(await indexedDbKeyStorage.load('alice')).toBeNull()
    await indexedDbKeyStorage.save('alice', keys)
    const loaded = await indexedDbKeyStorage.load('alice')
    expect(loaded?.ecdh.privateKey.type).toBe('private')
    expect(loaded?.ecdsa.publicKey.algorithm).toMatchObject({ name: 'ECDSA' })
    expect(await indexedDbKeyStorage.load('bob')).toBeNull()
  })
})
