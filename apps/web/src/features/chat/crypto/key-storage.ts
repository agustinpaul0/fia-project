export type ClientKeyStore = {
  readonly ecdh: CryptoKeyPair
  readonly ecdsa: CryptoKeyPair
}

export type KeyStorage = {
  readonly load: (userId: string) => Promise<ClientKeyStore | null>
  readonly save: (userId: string, keys: ClientKeyStore) => Promise<void>
}

const DB_NAME = 'fia-chat-keys'
const STORE = 'keys'

const request = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const openDb = (): Promise<IDBDatabase> => {
  const req = indexedDB.open(DB_NAME, 1)
  req.onupgradeneeded = () => req.result.createObjectStore(STORE)
  return request(req)
}

const withStore = async <T>(
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await openDb()
  try {
    return await request(run(db.transaction(STORE, mode).objectStore(STORE)))
  } finally {
    db.close()
  }
}

export const indexedDbKeyStorage: KeyStorage = {
  load: async (userId) =>
    ((await withStore('readonly', (s) => s.get(userId))) as ClientKeyStore | undefined) ?? null,
  save: async (userId, keys) => {
    await withStore('readwrite', (s) => s.put(keys, userId))
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
