import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  CreateEncryptedMessageBody,
  RegisterPublicKeysBody,
  UserPublicKeys,
} from '@fia/shared/contracts'

export type SendMessageParams = {
  readonly conversationId: string
  readonly senderId: string
  readonly body: CreateEncryptedMessageBody
}

export type ChatRepository = {
  readonly registerKeys: (userId: string, keys: RegisterPublicKeysBody) => Promise<void>
  readonly getUserKeys: (userId: string) => Promise<UserPublicKeys | null>
  readonly listConversations: (userId: string) => Promise<readonly ChatConversation[]>
  readonly getOrCreateConversation: (
    userId: string,
    recipientId: string,
  ) => Promise<ChatConversation>
  readonly isParticipant: (conversationId: string, userId: string) => Promise<boolean>
  readonly listContacts: (userId: string) => Promise<readonly ChatContact[]>
  readonly listMessages: (conversationId: string) => Promise<readonly ChatMessage[]>
  readonly sendMessage: (params: SendMessageParams) => Promise<ChatMessage>
}
