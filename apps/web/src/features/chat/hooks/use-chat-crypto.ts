import type { ChatConversation, ChatMessage } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { CHAT_QUERY_KEYS, getUserKeysApi } from '../api/chat-api'
import { type ConversationCipher, createConversationCipher } from '../crypto/conversation-cipher'
import { ensureMyKeys } from '../crypto/key-manager'

export type DecryptedMessage = {
  readonly id: string
  readonly senderName: string
  readonly sentAt: string
  readonly isMine: boolean
  readonly text: string | null
}

export const useMyKeysReady = (userId: string | null): UseQueryResult<true, Error> =>
  useQuery({
    queryKey: ['chat', 'my-keys', userId],
    queryFn: async () => {
      await ensureMyKeys(userId ?? '')
      return true as const
    },
    enabled: userId !== null,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })

export const useConversationCipher = (
  userId: string | null,
  conversation: ChatConversation | undefined,
): UseQueryResult<ConversationCipher, Error> => {
  const peerId = conversation?.otherUserId ?? ''
  return useQuery({
    queryKey: [...CHAT_QUERY_KEYS.userKeys(peerId), userId],
    queryFn: async () =>
      createConversationCipher(await ensureMyKeys(userId ?? ''), await getUserKeysApi(peerId)),
    enabled: userId !== null && conversation !== undefined,
    staleTime: Number.POSITIVE_INFINITY,
    retry: false,
  })
}

const decryptOne = async (
  cipher: ConversationCipher,
  message: ChatMessage,
  userId: string,
): Promise<DecryptedMessage> => {
  const isMine = message.senderId === userId
  const text = await cipher.decrypt(message, isMine).catch(() => null)
  return { id: message.id, senderName: message.senderName, sentAt: message.sentAt, isMine, text }
}

export const useDecryptedMessages = (params: {
  readonly cipher: ConversationCipher | undefined
  readonly messages: readonly ChatMessage[]
  readonly userId: string
}): readonly DecryptedMessage[] => {
  const { cipher, messages, userId } = params
  const { data = [] } = useQuery({
    queryKey: ['chat', 'decrypted', messages.map((m) => m.id).join(','), cipher !== undefined],
    queryFn: () =>
      cipher
        ? Promise.all(messages.map((m) => decryptOne(cipher, m, userId)))
        : Promise.resolve([]),
    enabled: cipher !== undefined,
  })
  return data
}
