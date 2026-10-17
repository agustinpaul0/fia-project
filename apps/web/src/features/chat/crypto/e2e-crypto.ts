import { base64ToBuffer, bufferToBase64 } from './crypto-utils'

export const generateE2EKeyPairs = async (): Promise<{
  ecdh: CryptoKeyPair
  ecdsa: CryptoKeyPair
}> => {
  const ecdh = await crypto.subtle.generateKey({ name: 'ECDH', namedCurve: 'P-256' }, false, [
    'deriveKey',
    'deriveBits',
  ])
  const ecdsa = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, false, [
    'sign',
    'verify',
  ])
  return { ecdh, ecdsa }
}

export const deriveSharedAesKey = async (
  privateEcdh: CryptoKey,
  publicEcdh: CryptoKey,
): Promise<CryptoKey> =>
  crypto.subtle.deriveKey(
    { name: 'ECDH', public: publicEcdh },
    privateEcdh,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  )

export const encryptE2EMessage = async (
  plainText: string,
  aesKey: CryptoKey,
  signKey: CryptoKey,
): Promise<{ encryptedContent: string; iv: string; signature: string }> => {
  const iv = crypto.getRandomValues(new Uint8Array(12))
  const encodedText = new TextEncoder().encode(plainText)
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, aesKey, encodedText)
  const signature = await crypto.subtle.sign(
    { name: 'ECDSA', hash: 'SHA-256' },
    signKey,
    ciphertext,
  )
  return {
    encryptedContent: bufferToBase64(ciphertext),
    iv: bufferToBase64(iv),
    signature: bufferToBase64(signature),
  }
}

export const decryptE2EMessage = async (params: {
  readonly encryptedContent: string
  readonly iv: string
  readonly signature: string
  readonly aesKey: CryptoKey
  readonly verifyKey: CryptoKey
}): Promise<string> => {
  const cipherBytes = base64ToBuffer(params.encryptedContent)
  const sigBytes = base64ToBuffer(params.signature)
  const ivBytes = base64ToBuffer(params.iv)

  const isValid = await crypto.subtle.verify(
    { name: 'ECDSA', hash: 'SHA-256' },
    params.verifyKey,
    sigBytes,
    cipherBytes,
  )
  if (!isValid) {
    throw new Error('Firma criptográfica inválida: el mensaje fue alterado o la clave no coincide.')
  }

  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: ivBytes },
    params.aesKey,
    cipherBytes,
  )
  return new TextDecoder().decode(decrypted)
}
