import { withIdbStore } from './idb'

export type ClientKeyStore = {
  readonly ecdh: CryptoKeyPair
  readonly ecdsa: CryptoKeyPair
}

export type KeyStorage = {
  readonly load: (userId: string) => Promise<ClientKeyStore | null>
  readonly save: (userId: string, keys: ClientKeyStore) => Promise<void>
}

const KEYS_DB = { dbName: 'fia-chat-keys', store: 'keys' } as const

export const indexedDbKeyStorage: KeyStorage = {
  load: async (userId) =>
    ((await withIdbStore(KEYS_DB, 'readonly', (s) => s.get(userId))) as
      | ClientKeyStore
      | undefined) ?? null,
  save: async (userId, keys) => {
    await withIdbStore(KEYS_DB, 'readwrite', (s) => s.put(keys, userId))
  },
}

export const createMemoryKeyStorage = (): KeyStorage => {
  const byUser = new Map<string, ClientKeyStore>()
  return {
    load: async (userId) => byUser.get(userId) ?? null,
    save: async (userId, keys) => {
      byUser.set(userId, keys)
    },
  }
}
