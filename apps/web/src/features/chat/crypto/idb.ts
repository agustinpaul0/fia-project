export type IdbStoreSpec = {
  readonly dbName: string
  readonly store: string
  readonly keyPath?: string
}

const request = <T>(req: IDBRequest<T>): Promise<T> =>
  new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })

const openDb = ({ dbName, store, keyPath }: IdbStoreSpec): Promise<IDBDatabase> => {
  const req = indexedDB.open(dbName, 1)
  req.onupgradeneeded = () =>
    req.result.createObjectStore(store, keyPath === undefined ? {} : { keyPath })
  return request(req)
}

export const withIdbStore = async <T>(
  spec: IdbStoreSpec,
  mode: IDBTransactionMode,
  run: (store: IDBObjectStore) => IDBRequest<T>,
): Promise<T> => {
  const db = await openDb(spec)
  try {
    return await request(run(db.transaction(spec.store, mode).objectStore(spec.store)))
  } finally {
    db.close()
  }
}
