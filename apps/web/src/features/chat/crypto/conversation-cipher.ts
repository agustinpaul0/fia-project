import type { ChatMessage, CreateEncryptedMessageBody, UserPublicKeys } from '@fia/shared/contracts'
import { importJwk } from './crypto-utils'
import { decryptE2EMessage, deriveSharedAesKey, encryptE2EMessage } from './e2e-crypto'
import type { ClientKeyStore } from './key-storage'

export type ConversationCipher = {
  readonly encrypt: (text: string) => Promise<CreateEncryptedMessageBody>
  readonly decrypt: (message: ChatMessage, isMine: boolean) => Promise<string>
}

const ECDH = { name: 'ECDH', namedCurve: 'P-256' } as const
const ECDSA = { name: 'ECDSA', namedCurve: 'P-256' } as const

export const createConversationCipher = async (
  mine: ClientKeyStore,
  peer: UserPublicKeys,
): Promise<ConversationCipher> => {
  const peerEcdh = await importJwk(peer.ecdhPublicKey, ECDH, [])
  const peerEcdsa = await importJwk(peer.ecdsaPublicKey, ECDSA, ['verify'])
  const aesKey = await deriveSharedAesKey(mine.ecdh.privateKey, peerEcdh)
  return {
    encrypt: (text) => encryptE2EMessage(text, aesKey, mine.ecdsa.privateKey),
    decrypt: (message, isMine) =>
      decryptE2EMessage({
        encryptedContent: message.encryptedContent,
        iv: message.iv,
        signature: message.signature,
        aesKey,
        verifyKey: isMine ? mine.ecdsa.publicKey : peerEcdsa,
      }),
  }
}
