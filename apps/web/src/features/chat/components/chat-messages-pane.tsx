import type { ChatConversation, ChatMessage } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { ChatInput } from './chat-input'
import { ChatMessageBubble } from './chat-message-bubble'
import { ChatSecurityBadge } from './chat-security-badge'

type Props = {
  readonly conversation: ChatConversation | undefined
  readonly messages: readonly ChatMessage[]
  readonly currentUserId: string
  readonly onSend: (text: string) => Promise<void>
}

export const ChatMessagesPane = ({
  conversation,
  messages,
  currentUserId,
  onSend,
}: Props): ReactNode => {
  if (!conversation) {
    return (
      <div className="flex h-full flex-col items-center justify-center p-8 text-center border-2 border-black bg-surface">
        <ChatSecurityBadge />
        <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">
          Seleccioná una conversación
        </h3>
        <p className="font-mono text-sm text-on-surface-variant max-w-sm mt-1">
          Todos los mensajes enviados a través de este canal son cifrados en tu dispositivo antes de
          viajar por la red.
        </p>
      </div>
    )
  }

  return (
    <div className="flex h-full flex-col border-2 border-black bg-surface shadow-brutal">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black bg-surface-container-high p-4">
        <div>
          <h2 className="font-headline font-bold text-lg text-on-surface">
            {conversation.otherUserName}
          </h2>
          <span className="font-mono text-xs text-on-surface-variant">
            {conversation.otherTeamName ??
              (conversation.otherUserRole === 'fia_admin' ? 'Administración FIA' : 'Personal')}
          </span>
        </div>
        <ChatSecurityBadge />
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[350px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="m-auto text-center font-mono text-xs text-on-surface-variant">
            No hay mensajes aún en esta conversación. El canal seguro está listo para transmitir.
          </div>
        ) : (
          messages.map((m) => (
            <ChatMessageBubble
              key={m.id}
              senderName={m.senderName}
              sentAt={m.sentAt}
              content={m.encryptedContent}
              isMine={m.senderId === currentUserId}
            />
          ))
        )}
      </div>

      <ChatInput onSend={onSend} />
    </div>
  )
}
