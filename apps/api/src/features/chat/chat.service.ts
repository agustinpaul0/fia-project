import type {
  ChatConversation,
  ChatMessage,
  CreateEncryptedMessageBody,
  RegisterPublicKeysBody,
  UserPublicKeys,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { ChatRepository } from './chat.port'

export type ChatService = {
  readonly registerKeys: (userId: string, keys: RegisterPublicKeysBody) => Promise<void>
  readonly getUserKeys: (userId: string) => Promise<UserPublicKeys>
  readonly listConversations: (userId: string) => Promise<readonly ChatConversation[]>
  readonly getOrCreateConversation: (
    userId: string,
    recipientId: string,
  ) => Promise<ChatConversation>
  readonly listMessages: (conversationId: string, userId: string) => Promise<readonly ChatMessage[]>
  readonly sendMessage: (params: {
    readonly conversationId: string
    readonly senderId: string
    readonly body: CreateEncryptedMessageBody
  }) => Promise<ChatMessage>
}

export const createChatService = (repo: ChatRepository): ChatService => ({
  registerKeys: (userId, keys) => repo.registerKeys(userId, keys),
  getUserKeys: async (userId) => {
    const keys = await repo.getUserKeys(userId)
    if (!keys) {
      throw new AppError('CHAT_KEY_NOT_FOUND')
    }
    return keys
  },
  listConversations: (userId) => repo.listConversations(userId),
  getOrCreateConversation: async (userId, recipientId) => {
    if (userId === recipientId) {
      throw new AppError('INVALID_CHAT_RECIPIENT')
    }
    return repo.getOrCreateConversation(userId, recipientId)
  },
  listMessages: async (conversationId, userId) => {
    const allowed = await repo.isParticipant(conversationId, userId)
    if (!allowed) {
      throw new AppError('CONVERSATION_NOT_FOUND')
    }
    return repo.listMessages(conversationId)
  },
  sendMessage: async ({ conversationId, senderId, body }) => {
    const allowed = await repo.isParticipant(conversationId, senderId)
    if (!allowed) {
      throw new AppError('CONVERSATION_NOT_FOUND')
    }
    return repo.sendMessage({ conversationId, senderId, body })
  },
})
