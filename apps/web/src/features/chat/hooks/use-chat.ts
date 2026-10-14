import type {
  ChatConversation,
  ChatMessage,
  CreateEncryptedMessageBody,
} from '@fia/shared/contracts'
import {
  type UseMutationResult,
  type UseQueryResult,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query'
import {
  CHAT_QUERY_KEYS,
  createConversationApi,
  fetchConversationsApi,
  fetchMessagesApi,
  sendMessageApi,
} from '../api/chat-api'

export const useConversations = (): UseQueryResult<readonly ChatConversation[], Error> =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.conversations,
    queryFn: fetchConversationsApi,
  })

export const useConversationMessages = (
  conversationId: string | null,
): UseQueryResult<readonly ChatMessage[], Error> =>
  useQuery({
    queryKey: CHAT_QUERY_KEYS.messages(conversationId ?? ''),
    queryFn: () => (conversationId ? fetchMessagesApi(conversationId) : Promise.resolve([])),
    enabled: Boolean(conversationId),
  })

export const useCreateConversation = (): UseMutationResult<ChatConversation, Error, string> => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createConversationApi,
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.conversations })
    },
  })
}

export const useSendMessage = (
  conversationId: string,
): UseMutationResult<ChatMessage, Error, CreateEncryptedMessageBody> => {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (body) => sendMessageApi(conversationId, body),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: CHAT_QUERY_KEYS.messages(conversationId) })
    },
  })
}
