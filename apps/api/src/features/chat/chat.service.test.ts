import type { ChatConversation, ChatMessage, UserPublicKeys } from '@fia/shared/contracts'
import { describe, expect, it, vi } from 'vitest'
import type { ChatRepository } from './chat.port'
import { createChatService } from './chat.service'

const mockUserKeys: UserPublicKeys = {
  userId: 'user-2',
  userName: 'Lewis Hamilton',
  userRole: 'team_staff',
  teamName: 'Ferrari',
  ecdhPublicKey: 'ecdh-pub-2',
  ecdsaPublicKey: 'ecdsa-pub-2',
}

const mockConv: ChatConversation = {
  id: '00000000-0000-4000-8000-000000000001',
  otherUserId: 'user-2',
  otherUserName: 'Lewis Hamilton',
  otherUserRole: 'team_staff',
  otherTeamName: 'Ferrari',
  createdAt: '2026-10-14T12:00:00.000Z',
}

const mockMessage: ChatMessage = {
  id: '00000000-0000-4000-8000-000000000010',
  conversationId: mockConv.id,
  senderId: 'user-1',
  senderName: 'Admin FIA',
  recipientId: 'user-2',
  encryptedContent: 'enc-content',
  iv: 'iv-string',
  signature: 'sig-string',
  sentAt: '2026-10-14T12:01:00.000Z',
  version: 1,
}

describe('ChatService', () => {
  const createMockRepo = (overrides?: Partial<ChatRepository>): ChatRepository => ({
    registerKeys: vi.fn().mockResolvedValue(undefined),
    getUserKeys: vi.fn().mockResolvedValue(mockUserKeys),
    listConversations: vi.fn().mockResolvedValue([mockConv]),
    getOrCreateConversation: vi.fn().mockResolvedValue(mockConv),
    isParticipant: vi.fn().mockResolvedValue(true),
    listMessages: vi.fn().mockResolvedValue([mockMessage]),
    sendMessage: vi.fn().mockResolvedValue(mockMessage),
    ...overrides,
  })

  it('obtiene claves de usuario o lanza CHAT_KEY_NOT_FOUND', async () => {
    const service = createChatService(createMockRepo())
    const keys = await service.getUserKeys('user-2')
    expect(keys.userId).toBe('user-2')

    const emptyService = createChatService(
      createMockRepo({ getUserKeys: vi.fn().mockResolvedValue(null) }),
    )
    await expect(emptyService.getUserKeys('user-unknown')).rejects.toMatchObject({
      code: 'CHAT_KEY_NOT_FOUND',
    })
  })

  it('rechaza conversación con uno mismo', async () => {
    const service = createChatService(createMockRepo())
    await expect(service.getOrCreateConversation('user-1', 'user-1')).rejects.toMatchObject({
      code: 'INVALID_CHAT_RECIPIENT',
    })
  })

  it('lista mensajes o lanza CONVERSATION_NOT_FOUND si no es participante', async () => {
    const service = createChatService(createMockRepo())
    const msgs = await service.listMessages(mockConv.id, 'user-1')
    expect(msgs).toHaveLength(1)

    const unauthService = createChatService(
      createMockRepo({ isParticipant: vi.fn().mockResolvedValue(false) }),
    )
    await expect(unauthService.listMessages(mockConv.id, 'user-3')).rejects.toMatchObject({
      code: 'CONVERSATION_NOT_FOUND',
    })
  })

  it('envía mensaje cifrado validando pertenencia', async () => {
    const service = createChatService(createMockRepo())
    const msg = await service.sendMessage({
      conversationId: mockConv.id,
      senderId: 'user-1',
      body: { encryptedContent: 'c', iv: 'iv-1234567890', signature: 'sig-123456789012' },
    })
    expect(msg.encryptedContent).toBe('enc-content')
  })
})
