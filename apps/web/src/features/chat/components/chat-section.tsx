import type { CreateEncryptedMessageBody } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'
import type { ConversationCipher } from '../crypto/conversation-cipher'
import { useConversationMessages, useConversations, useSendMessage } from '../hooks/use-chat'
import {
  useConversationCipher,
  useDecryptedMessages,
  useMyKeysReady,
} from '../hooks/use-chat-crypto'
import { ChatConversationList } from './chat-conversation-list'
import { ChatMessagesPane } from './chat-messages-pane'
import { ChatNewConversation } from './chat-new-conversation'

type Sender = {
  readonly cipher: ConversationCipher
  readonly sendMessage: (body: CreateEncryptedMessageBody) => Promise<unknown>
}

const sendWith =
  ({ cipher, sendMessage }: Sender) =>
  async (text: string): Promise<void> => {
    await sendMessage(await cipher.encrypt(text)).catch((error: unknown) => {
      toast.error('Error al enviar el mensaje cifrado')
      throw error
    })
  }

export const MY_KEYS_ERROR = 'No pudimos preparar tus claves de cifrado. Recargá la página.'

export const ChatSection = (): ReactNode => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? null
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const { data: conversations = [], isLoading } = useConversations()
  const { data: messages = [] } = useConversationMessages(selectedConvId)
  const sendMutation = useSendMessage(selectedConvId ?? '')
  const myKeys = useMyKeysReady(userId)
  const activeConv = conversations.find((c) => c.id === selectedConvId)
  const cipher = useConversationCipher(userId, activeConv)
  const decrypted = useDecryptedMessages({ cipher: cipher.data, messages, userId: userId ?? '' })
  const cryptoError = myKeys.error ? MY_KEYS_ERROR : (cipher.error?.message ?? null)
  const send = cipher.data
    ? sendWith({ cipher: cipher.data, sendMessage: sendMutation.mutateAsync })
    : null

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-bold font-headline text-2xl text-on-surface uppercase tracking-wide">
          Mensajería Cifrada Extremo a Extremo
        </h1>
        <p className="font-mono text-on-surface-variant text-sm">
          Canal privado entre la Federación y las escuderías. El servidor sólo guarda mensajes
          cifrados.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="border-2 border-black bg-surface p-4 shadow-brutal flex flex-col gap-3">
          <ChatNewConversation onCreated={setSelectedConvId} />
          <div className="font-mono text-xs font-bold uppercase tracking-wider text-on-surface-variant border-b-2 border-outline pb-2">
            Conversaciones Activas ({conversations.length})
          </div>
          <ChatConversationList
            isLoading={isLoading}
            conversations={conversations}
            selectedId={selectedConvId}
            onSelect={setSelectedConvId}
          />
        </div>
        <div className="md:col-span-2">
          <ChatMessagesPane
            conversation={activeConv}
            messages={decrypted}
            cryptoError={cryptoError}
            onSend={send}
          />
        </div>
      </div>
    </div>
  )
}
