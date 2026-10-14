import {
  API_PATHS,
  type ChatConversation,
  type ChatMessage,
  type CreateEncryptedMessageBody,
  chatConversationListSchema,
  chatConversationSchema,
  chatMessageListSchema,
  chatMessageSchema,
  type RegisterPublicKeysBody,
  registerPublicKeysBodySchema,
  type UserPublicKeys,
  userPublicKeysSchema,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const CHAT_QUERY_KEYS = {
  conversations: ['chat', 'conversations'] as const,
  messages: (convId: string) => ['chat', 'messages', convId] as const,
  userKeys: (userId: string) => ['chat', 'keys', userId] as const,
}

export const registerKeysApi = (body: RegisterPublicKeysBody): Promise<RegisterPublicKeysBody> =>
  apiRequest({
    path: `${API_PATHS.chat}/keys`,
    method: 'POST',
    body,
    schema: registerPublicKeysBodySchema,
  })

export const getUserKeysApi = (userId: string): Promise<UserPublicKeys> =>
  apiRequest({
    path: `${API_PATHS.chat}/keys/${userId}`,
    schema: userPublicKeysSchema,
  })

export const fetchConversationsApi = (): Promise<readonly ChatConversation[]> =>
  apiRequest({
    path: `${API_PATHS.chat}/conversations`,
    schema: chatConversationListSchema,
  })

export const createConversationApi = (recipientId: string): Promise<ChatConversation> =>
  apiRequest({
    path: `${API_PATHS.chat}/conversations`,
    method: 'POST',
    body: { recipientId },
    schema: chatConversationSchema,
  })

export const fetchMessagesApi = (conversationId: string): Promise<readonly ChatMessage[]> =>
  apiRequest({
    path: `${API_PATHS.chat}/conversations/${conversationId}/messages`,
    schema: chatMessageListSchema,
  })

export const sendMessageApi = (
  conversationId: string,
  body: CreateEncryptedMessageBody,
): Promise<ChatMessage> =>
  apiRequest({
    path: `${API_PATHS.chat}/conversations/${conversationId}/messages`,
    method: 'POST',
    body,
    schema: chatMessageSchema,
  })
