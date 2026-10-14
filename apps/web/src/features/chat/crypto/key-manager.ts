import { registerKeysApi } from '../api/chat-api'
import { exportJwk } from './crypto-utils'
import { generateE2EKeyPairs } from './e2e-crypto'

export type ClientKeyStore = {
  ecdh: CryptoKeyPair
  ecdsa: CryptoKeyPair
}

let activeStore: ClientKeyStore | null = null

export const ensureMyKeys = async (_userId: string): Promise<ClientKeyStore> => {
  if (activeStore) {
    return activeStore
  }
  const keyPairs = await generateE2EKeyPairs()
  const ecdhPublicKey = await exportJwk(keyPairs.ecdh.publicKey)
  const ecdsaPublicKey = await exportJwk(keyPairs.ecdsa.publicKey)

  try {
    await registerKeysApi({ ecdhPublicKey, ecdsaPublicKey })
  } catch {
    // Si ya están registradas o falla la red, continuamos con el store local
  }

  activeStore = keyPairs
  return keyPairs
}

export const getActiveKeyStore = (): ClientKeyStore | null => activeStore
