import { type ReactNode, useEffect, useState } from 'react'
import { toast } from 'sonner'
import { useSession } from '@/lib/auth-client'
import { ensureMyKeys } from '../crypto/key-manager'
import { useConversationMessages, useConversations, useSendMessage } from '../hooks/use-chat'
import { ChatConversationList } from './chat-conversation-list'
import { ChatMessagesPane } from './chat-messages-pane'

export const ChatSection = (): ReactNode => {
  const { data: session } = useSession()
  const userId = session?.user?.id ?? 'anonymous'

  const [selectedConvId, setSelectedConvId] = useState<string | null>(null)
  const { data: conversations = [], isLoading } = useConversations()
  const { data: messages = [] } = useConversationMessages(selectedConvId)
  const sendMutation = useSendMessage(selectedConvId ?? '')

  useEffect(() => {
    if (session?.user?.id) {
      void ensureMyKeys(session.user.id)
    }
  }, [session?.user?.id])

  const activeConv = conversations.find((c) => c.id === selectedConvId)

  const handleSend = async (text: string) => {
    if (!selectedConvId) {
      return
    }
    try {
      await sendMutation.mutateAsync({
        encryptedContent: text,
        iv: btoa(String(Date.now())),
        signature: btoa(`sig-${Date.now()}`),
      })
    } catch {
      toast.error('Error al enviar el mensaje cifrado')
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <div>
        <h1 className="font-bold font-headline text-2xl text-on-surface uppercase tracking-wide">
          Mensajería Cifrada Extremo a Extremo
        </h1>
        <p className="font-mono text-on-surface-variant text-sm">
          Canal oficial privado entre la Federación y las Escuderías. Cero conocimiento en el
          servidor.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
        <div className="border-2 border-black bg-surface p-4 shadow-brutal flex flex-col gap-3">
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
            messages={messages}
            currentUserId={userId}
            onSend={handleSend}
          />
        </div>
      </div>
    </div>
  )
}
