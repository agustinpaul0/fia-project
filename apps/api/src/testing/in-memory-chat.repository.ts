import type { ChatConversation, ChatMessage, RegisterPublicKeysBody } from '@fia/shared/contracts'
import type { ChatRepository, SendMessageParams } from '../features/chat/chat.port'

export type InMemoryChatRepository = ChatRepository & {
  readonly conversations: ChatConversation[]
  readonly messages: ChatMessage[]
  readonly keys: Map<string, RegisterPublicKeysBody>
}

const buildKeyRecord = (userId: string, k: RegisterPublicKeysBody) => ({
  userId,
  userName: `User ${userId}`,
  userRole: 'team_staff' as const,
  teamName: 'Test Team',
  ecdhPublicKey: k.ecdhPublicKey,
  ecdsaPublicKey: k.ecdsaPublicKey,
})

const buildNewConversation = (recipientId: string, idx: number): ChatConversation => ({
  id: `00000000-0000-4000-8000-${String(idx).padStart(12, '0')}`,
  otherUserId: recipientId,
  otherUserName: `User ${recipientId}`,
  otherUserRole: 'team_staff',
  otherTeamName: 'Test Team',
  createdAt: new Date().toISOString(),
})

const buildNewMessage = (p: SendMessageParams, idx: number): ChatMessage => ({
  id: `00000000-0000-4000-8000-${String(idx).padStart(12, '0')}`,
  conversationId: p.conversationId,
  senderId: p.senderId,
  senderName: 'Test Sender',
  recipientId: 'recipient-1',
  encryptedContent: p.body.encryptedContent,
  iv: p.body.iv,
  signature: p.body.signature,
  sentAt: new Date().toISOString(),
  version: 1,
})

export const createInMemoryChatRepository = (
  initialConversations: readonly ChatConversation[] = [],
  initialMessages: readonly ChatMessage[] = [],
): InMemoryChatRepository => {
  const conversations: ChatConversation[] = [...initialConversations]
  const messages: ChatMessage[] = [...initialMessages]
  const keys = new Map<string, RegisterPublicKeysBody>()

  return {
    conversations,
    messages,
    keys,
    registerKeys: async (userId, userKeys) => {
      keys.set(userId, userKeys)
    },
    getUserKeys: async (userId) => {
      const k = keys.get(userId)
      return k ? buildKeyRecord(userId, k) : null
    },
    listConversations: async () => conversations,
    getOrCreateConversation: async (_userId, recipientId) => {
      const existing = conversations.find((c) => c.otherUserId === recipientId)
      if (existing) {
        return existing
      }
      const conv = buildNewConversation(recipientId, conversations.length + 1)
      conversations.push(conv)
      return conv
    },
    isParticipant: async () => true,
    listMessages: async (cId) => messages.filter((m) => m.conversationId === cId),
    sendMessage: async (p) => {
      const msg = buildNewMessage(p, messages.length + 1)
      messages.push(msg)
      return msg
    },
  }
}
