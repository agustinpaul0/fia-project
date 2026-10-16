import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  RegisterPublicKeysBody,
  UserPublicKeys,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type { ChatRepository, SendMessageParams } from './chat.port'

export type ChatService = {
  readonly registerKeys: (userId: string, keys: RegisterPublicKeysBody) => Promise<void>
  readonly getUserKeys: (userId: string) => Promise<UserPublicKeys>
  readonly listContacts: (userId: string) => Promise<readonly ChatContact[]>
  readonly listConversations: (userId: string) => Promise<readonly ChatConversation[]>
  readonly getOrCreateConversation: (
    userId: string,
    recipientId: string,
  ) => Promise<ChatConversation>
  readonly listMessages: (conversationId: string, userId: string) => Promise<readonly ChatMessage[]>
  readonly sendMessage: (params: SendMessageParams) => Promise<ChatMessage>
}

const assertParticipant = async (repo: ChatRepository, convId: string, userId: string) => {
  if (!(await repo.isParticipant(convId, userId))) {
    throw new AppError('CONVERSATION_NOT_FOUND')
  }
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
  listContacts: (userId) => repo.listContacts(userId),
  listConversations: (userId) => repo.listConversations(userId),
  getOrCreateConversation: async (userId, recipientId) => {
    const contacts = await repo.listContacts(userId)
    if (!contacts.some((c) => c.id === recipientId)) {
      throw new AppError('INVALID_CHAT_RECIPIENT')
    }
    if ((await repo.getUserKeys(recipientId)) === null) {
      throw new AppError('CHAT_KEY_NOT_FOUND')
    }
    return repo.getOrCreateConversation(userId, recipientId)
  },
  listMessages: async (conversationId, userId) => {
    await assertParticipant(repo, conversationId, userId)
    return repo.listMessages(conversationId)
  },
  sendMessage: async (params) => {
    await assertParticipant(repo, params.conversationId, params.senderId)
    return repo.sendMessage(params)
  },
})
