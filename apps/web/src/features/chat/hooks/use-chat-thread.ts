import type {
  ChatConversation,
  ChatMessage,
  CreateEncryptedMessageBody,
} from '@fia/shared/contracts'
import { toast } from 'sonner'
import type { ConversationCipher } from '../crypto/conversation-cipher'
import type { OutboxItem } from '../crypto/outbox-storage'
import { type DecryptedMessage, useDecryptedMessages } from './use-chat-crypto'
import { isNetworkError, useOutbox } from './use-outbox'

type Send = (body: CreateEncryptedMessageBody) => Promise<unknown>

type ThreadParams = {
  readonly userId: string
  readonly conversation: ChatConversation | undefined
  readonly messages: readonly ChatMessage[]
  readonly cipher: ConversationCipher | undefined
  readonly sendMessage: Send
}

export const OFFLINE_NOTICE = 'Sin conexión: el mensaje se enviará cuando vuelva la conexión.'

const sendWith =
  (cipher: ConversationCipher, sendMessage: Send, enqueue: Send) =>
  async (text: string): Promise<void> => {
    const body = await cipher.encrypt(text)
    await sendMessage(body).catch(async (error: unknown) => {
      if (isNetworkError(error)) {
        await enqueue(body)
        toast.info(OFFLINE_NOTICE)
        return
      }
      toast.error('Error al enviar el mensaje cifrado')
      throw error
    })
  }

const asMessage = (item: OutboxItem, userId: string, recipientId: string): ChatMessage => ({
  id: item.id,
  conversationId: item.conversationId,
  senderId: userId,
  senderName: 'Vos',
  recipientId,
  ...item.body,
  sentAt: item.createdAt,
  version: 1,
})

export const useChatThread = (params: ThreadParams) => {
  const { userId, conversation, messages, cipher, sendMessage } = params
  const outbox = useOutbox(conversation?.id ?? '', sendMessage)
  const pending = outbox.pending.map((i) => asMessage(i, userId, conversation?.otherUserId ?? ''))
  const decrypted = useDecryptedMessages({ cipher, messages: [...messages, ...pending], userId })
  const pendingIds = new Set(pending.map((m) => m.id))
  const thread: readonly DecryptedMessage[] = decrypted.map((m) =>
    pendingIds.has(m.id) ? { ...m, pending: true } : m,
  )
  const send = cipher ? sendWith(cipher, sendMessage, outbox.enqueue) : null
  return { thread, send }
}
