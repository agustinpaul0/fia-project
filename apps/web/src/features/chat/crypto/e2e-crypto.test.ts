import { describe, expect, it } from 'vitest'
import { exportJwk, importJwk } from './crypto-utils'
import {
  decryptE2EMessage,
  deriveSharedAesKey,
  encryptE2EMessage,
  generateE2EKeyPairs,
} from './e2e-crypto'

describe('Protocolo Criptográfico E2E', () => {
  it('cifra, firma y descifra exitosamente entre dos partes', async () => {
    const alice = await generateE2EKeyPairs()
    const bob = await generateE2EKeyPairs()

    const aliceJwkPub = await exportJwk(alice.ecdh.publicKey)
    const bobJwkPub = await exportJwk(bob.ecdh.publicKey)

    const bobEcdhKeyForAlice = await importJwk(bobJwkPub, { name: 'ECDH', namedCurve: 'P-256' }, [])
    const aliceEcdhKeyForBob = await importJwk(
      aliceJwkPub,
      { name: 'ECDH', namedCurve: 'P-256' },
      [],
    )

    const aliceSharedKey = await deriveSharedAesKey(alice.ecdh.privateKey, bobEcdhKeyForAlice)
    const bobSharedKey = await deriveSharedAesKey(bob.ecdh.privateKey, aliceEcdhKeyForBob)

    const message = 'Reporte técnico confidencial de telemetría.'
    const payload = await encryptE2EMessage(message, aliceSharedKey, alice.ecdsa.privateKey)

    expect(payload.encryptedContent).not.toBe(message)
    expect(payload.iv.length).toBeGreaterThan(0)
    expect(payload.signature.length).toBeGreaterThan(0)

    const decrypted = await decryptE2EMessage({
      encryptedContent: payload.encryptedContent,
      iv: payload.iv,
      signature: payload.signature,
      aesKey: bobSharedKey,
      verifyKey: alice.ecdsa.publicKey,
    })

    expect(decrypted).toBe(message)
  })

  it('rechaza el descifrado si la firma fue alterada', async () => {
    const alice = await generateE2EKeyPairs()
    const bob = await generateE2EKeyPairs()

    const aliceSharedKey = await deriveSharedAesKey(alice.ecdh.privateKey, bob.ecdh.publicKey)
    const bobSharedKey = await deriveSharedAesKey(bob.ecdh.privateKey, alice.ecdh.publicKey)

    const payload = await encryptE2EMessage('Hola', aliceSharedKey, alice.ecdsa.privateKey)

    await expect(
      decryptE2EMessage({
        encryptedContent: payload.encryptedContent,
        iv: payload.iv,
        signature: 'aW52YWxpZFNpZ25hdHVyZVN0cmluZw==',
        aesKey: bobSharedKey,
        verifyKey: alice.ecdsa.publicKey,
      }),
    ).rejects.toThrow(/Firma criptográfica inválida/)
  })
})
