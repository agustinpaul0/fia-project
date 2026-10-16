import type {
  ChatContact,
  ChatConversation,
  ChatMessage,
  RegisterPublicKeysBody,
} from '@fia/shared/contracts'
import type { ChatRepository, SendMessageParams } from '../features/chat/chat.port'

export type StoredConversation = ChatConversation & { readonly participants: readonly string[] }

export type InMemoryChatRepository = ChatRepository & {
  readonly conversations: StoredConversation[]
  readonly messages: ChatMessage[]
  readonly keys: Map<string, RegisterPublicKeysBody>
}

const idOf = (n: number): string => `00000000-0000-4000-8000-${String(n).padStart(12, '0')}`

const toConversation = (c: StoredConversation, userId: string): ChatConversation => {
  const { participants, ...rest } = c
  return { ...rest, otherUserId: participants.find((p) => p !== userId) ?? rest.otherUserId }
}

const buildMessage = (p: SendMessageParams, idx: number, recipientId: string): ChatMessage => ({
  id: idOf(idx),
  conversationId: p.conversationId,
  senderId: p.senderId,
  senderName: `User ${p.senderId}`,
  recipientId,
  ...p.body,
  sentAt: new Date().toISOString(),
  version: 1,
})

type GetOrCreateParams = {
  readonly conversations: StoredConversation[]
  readonly contacts: readonly ChatContact[]
  readonly pair: readonly [string, string]
}

const getOrCreate = ({ conversations, contacts, pair }: GetOrCreateParams): ChatConversation => {
  const [userId, recipientId] = pair
  const existing = conversations.find(
    (c) => c.participants.includes(userId) && c.participants.includes(recipientId),
  )
  if (existing) {
    return toConversation(existing, userId)
  }
  const other = contacts.find((c) => c.id === recipientId)
  const conv: StoredConversation = {
    id: idOf(conversations.length + 1),
    otherUserId: recipientId,
    otherUserName: other?.name ?? recipientId,
    otherUserRole: other?.role ?? 'team_staff',
    otherTeamName: other?.teamName ?? null,
    createdAt: new Date().toISOString(),
    participants: [userId, recipientId],
  }
  conversations.push(conv)
  return toConversation(conv, userId)
}

export const createInMemoryChatRepository = (contacts: readonly ChatContact[] = []) => {
  const conversations: StoredConversation[] = []
  const messages: ChatMessage[] = []
  const keys = new Map<string, RegisterPublicKeysBody>()
  const find = (id: string) => conversations.find((c) => c.id === id)
  const repo: InMemoryChatRepository = {
    conversations,
    messages,
    keys,
    registerKeys: async (userId, userKeys) => {
      keys.set(userId, userKeys)
    },
    getUserKeys: async (userId) => {
      const k = keys.get(userId)
      return k
        ? { userId, userName: `User ${userId}`, userRole: 'team_staff', teamName: null, ...k }
        : null
    },
    listContacts: async (userId) => contacts.filter((c) => c.id !== userId),
    listConversations: async (userId) =>
      conversations
        .filter((c) => c.participants.includes(userId))
        .map((c) => toConversation(c, userId)),
    getOrCreateConversation: async (userId, recipientId) =>
      getOrCreate({ conversations, contacts, pair: [userId, recipientId] }),
    isParticipant: async (convId, userId) => find(convId)?.participants.includes(userId) ?? false,
    listMessages: async (cId) => messages.filter((m) => m.conversationId === cId),
    sendMessage: async (p) => {
      const recipient = find(p.conversationId)?.participants.find((u) => u !== p.senderId) ?? ''
      const msg = buildMessage(p, messages.length + 1, recipient)
      messages.push(msg)
      return msg
    },
  }
  return repo
}
