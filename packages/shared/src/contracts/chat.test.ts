import { describe, expect, it } from 'vitest'
import {
  chatConversationSchema,
  chatMessageSchema,
  createConversationBodySchema,
  createEncryptedMessageBodySchema,
  registerPublicKeysBodySchema,
  userPublicKeysSchema,
} from './chat'

describe('chat contracts', () => {
  const validUuid = '11111111-1111-4111-8111-111111111111'

  it('valida registro de claves públicas', () => {
    const parsed = registerPublicKeysBodySchema.parse({
      ecdhPublicKey: '{"kty":"EC","crv":"P-256","x":"...","y":"..."}',
      ecdsaPublicKey: '{"kty":"EC","crv":"P-256","x":"...","y":"..."}',
    })
    expect(parsed.ecdhPublicKey).toContain('P-256')
  })

  it('rechaza claves públicas demasiado cortas', () => {
    expect(() =>
      registerPublicKeysBodySchema.parse({
        ecdhPublicKey: 'short',
        ecdsaPublicKey: 'short',
      }),
    ).toThrow()
  })

  it('valida creación de conversación', () => {
    const parsed = createConversationBodySchema.parse({
      recipientId: 'user-2',
    })
    expect(parsed.recipientId).toBe('user-2')
  })

  it('valida payload de mensaje cifrado', () => {
    const parsed = createEncryptedMessageBodySchema.parse({
      encryptedContent: 'aW5pdGlhbFBheWxvYWQ=',
      iv: 'MTIzNDU2Nzg5MDEy',
      signature: 'c2lnbmF0dXJlRXhhbXBsZVN0cmluZw==',
    })
    expect(parsed.encryptedContent).toBe('aW5pdGlhbFBheWxvYWQ=')
  })

  it('valida DTO completo de mensaje de chat', () => {
    const dto = {
      id: validUuid,
      conversationId: validUuid,
      senderId: 'user-1',
      senderName: 'Toto Wolff',
      recipientId: 'user-2',
      encryptedContent: 'aW5pdGlhbFBheWxvYWQ=',
      iv: 'MTIzNDU2Nzg5MDEy',
      signature: 'c2lnbmF0dXJlRXhhbXBsZVN0cmluZw==',
      sentAt: '2026-10-14T12:00:00.000Z',
      version: 1,
    }
    const parsed = chatMessageSchema.parse(dto)
    expect(parsed.senderName).toBe('Toto Wolff')
    expect(parsed.version).toBe(1)
  })

  it('valida DTO de conversación y claves de usuario', () => {
    const conv = chatConversationSchema.parse({
      id: validUuid,
      otherUserId: 'user-2',
      otherUserName: 'Christian Horner',
      otherUserRole: 'team_staff',
      otherTeamName: 'Red Bull Racing',
      createdAt: '2026-10-14T12:00:00.000Z',
    })
    expect(conv.otherTeamName).toBe('Red Bull Racing')

    const userKeys = userPublicKeysSchema.parse({
      userId: 'user-2',
      userName: 'Christian Horner',
      userRole: 'team_staff',
      teamName: 'Red Bull Racing',
      ecdhPublicKey: '{"kty":"EC"}',
      ecdsaPublicKey: '{"kty":"EC"}',
    })
    expect(userKeys.userName).toBe('Christian Horner')
  })
})
