import { type ReactNode, useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { useConversationMessages, useConversations, useSendMessage } from '../hooks/use-chat'
import { useConversationCipher, useMyKeysReady } from '../hooks/use-chat-crypto'
import { useChatThread } from '../hooks/use-chat-thread'
import { ChatConversationList } from './chat-conversation-list'
import { ChatMessagesPane } from './chat-messages-pane'
import { ChatNewConversation } from './chat-new-conversation'

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
  const { thread, send } = useChatThread({
    userId: userId ?? '',
    conversation: activeConv,
    messages,
    cipher: cipher.data,
    sendMessage: sendMutation.mutateAsync,
  })
  const cryptoError = myKeys.error ? MY_KEYS_ERROR : (cipher.error?.message ?? null)

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
            messages={thread}
            cryptoError={cryptoError}
            onSend={send}
          />
        </div>
      </div>
    </div>
  )
}
