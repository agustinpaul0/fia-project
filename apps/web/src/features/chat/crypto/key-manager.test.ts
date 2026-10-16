import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { ensureMyKeys } from './key-manager'
import { createMemoryKeyStorage } from './key-storage'

describe('ensureMyKeys', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('genera las claves una vez, las guarda y publica sólo las públicas', async () => {
    const calls = mockFetchRoutes({ 'POST /chat/keys': () => jsonResponse(calls.at(-1)?.body) })
    const storage = createMemoryKeyStorage()
    const first = await ensureMyKeys('alice', storage)
    const again = await ensureMyKeys('alice', storage)
    expect(again).toBe(first)
    expect(await storage.load('alice')).toBe(first)
    expect(first.ecdh.privateKey.extractable).toBe(false)
    expect(first.ecdsa.privateKey.extractable).toBe(false)
    const bodies = calls.map((c) => JSON.stringify(c.body))
    expect(bodies).toHaveLength(2)
    expect(bodies[0]).toBe(bodies[1])
    expect(bodies[0]).not.toContain('"d"')
  })

  it('cada usuario tiene sus propias claves', async () => {
    const calls = mockFetchRoutes({ 'POST /chat/keys': () => jsonResponse(calls.at(-1)?.body) })
    const storage = createMemoryKeyStorage()
    const alice = await ensureMyKeys('alice', storage)
    expect(await ensureMyKeys('bob', storage)).not.toBe(alice)
    expect(await storage.load('carol')).toBeNull()
  })

  it('falla si el servidor no acepta las claves', async () => {
    mockFetchRoutes({})
    await expect(ensureMyKeys('alice', createMemoryKeyStorage())).rejects.toBeDefined()
  })
})
