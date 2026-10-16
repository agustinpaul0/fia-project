import { registerKeysApi } from '../api/chat-api'
import { exportJwk } from './crypto-utils'
import { generateE2EKeyPairs } from './e2e-crypto'
import { type ClientKeyStore, indexedDbKeyStorage, type KeyStorage } from './key-storage'

export type { ClientKeyStore } from './key-storage'

const loadOrCreate = async (userId: string, storage: KeyStorage): Promise<ClientKeyStore> => {
  const stored = await storage.load(userId)
  if (stored !== null) {
    return stored
  }
  const created = await generateE2EKeyPairs()
  await storage.save(userId, created)
  return created
}

export const ensureMyKeys = async (
  userId: string,
  storage: KeyStorage = indexedDbKeyStorage,
): Promise<ClientKeyStore> => {
  const keys = await loadOrCreate(userId, storage)
  await registerKeysApi({
    ecdhPublicKey: await exportJwk(keys.ecdh.publicKey),
    ecdsaPublicKey: await exportJwk(keys.ecdsa.publicKey),
  })
  return keys
}
