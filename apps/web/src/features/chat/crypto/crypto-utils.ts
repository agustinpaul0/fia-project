export const bufferToBase64 = (buffer: ArrayBuffer | Uint8Array): string => {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i] ?? 0)
  }
  return btoa(binary)
}

export const base64ToBuffer = (base64: string): Uint8Array<ArrayBuffer> => {
  const binary = atob(base64)
  const buffer = new ArrayBuffer(binary.length)
  const bytes = new Uint8Array(buffer)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

export const exportJwk = async (key: CryptoKey): Promise<string> => {
  const jwk = await crypto.subtle.exportKey('jwk', key)
  return JSON.stringify(jwk)
}

export const importJwk = async (
  jwkJson: string,
  algorithm: EcKeyImportParams,
  keyUsages: KeyUsage[],
): Promise<CryptoKey> => {
  const jwk = JSON.parse(jwkJson) as JsonWebKey
  return crypto.subtle.importKey('jwk', jwk, algorithm, true, keyUsages)
}
