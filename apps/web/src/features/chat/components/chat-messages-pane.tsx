import type { ChatConversation } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import type { DecryptedMessage } from '../hooks/use-chat-crypto'
import { ChatInput } from './chat-input'
import { ChatMessageBubble } from './chat-message-bubble'
import { ChatSecurityBadge } from './chat-security-badge'

type Props = {
  readonly conversation: ChatConversation | undefined
  readonly messages: readonly DecryptedMessage[]
  readonly cryptoError: string | null
  readonly onSend: ((text: string) => Promise<void>) | null
}

const EmptyPane = (): ReactNode => (
  <div className="flex h-full flex-col items-center justify-center p-8 text-center border-2 border-black bg-surface">
    <ChatSecurityBadge />
    <h3 className="mt-4 font-headline text-lg font-bold text-on-surface">
      Seleccioná una conversación
    </h3>
    <p className="font-mono text-sm text-on-surface-variant max-w-sm mt-1">
      Todos los mensajes se cifran en tu dispositivo antes de viajar por la red.
    </p>
  </div>
)

export const ChatMessagesPane = ({
  conversation,
  messages,
  cryptoError,
  onSend,
}: Props): ReactNode => {
  if (!conversation) {
    return <EmptyPane />
  }
  return (
    <div className="flex h-full flex-col border-2 border-black bg-surface shadow-brutal">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b-2 border-black bg-surface-container-high p-4">
        <div>
          <h2 className="font-headline font-bold text-lg text-on-surface">
            {conversation.otherUserName}
          </h2>
          <span className="font-mono text-xs text-on-surface-variant">
            {conversation.otherTeamName ?? 'Administración FIA'}
          </span>
        </div>
        {cryptoError === null && <ChatSecurityBadge />}
      </div>
      {cryptoError !== null && (
        <p role="alert" className="border-b-2 border-red-700 bg-red-50 p-3 text-red-900 text-sm">
          {cryptoError}
        </p>
      )}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-[350px] max-h-[500px]">
        {messages.length === 0 ? (
          <div className="m-auto text-center font-mono text-xs text-on-surface-variant">
            No hay mensajes aún en esta conversación.
          </div>
        ) : (
          messages.map((m) => <ChatMessageBubble key={m.id} message={m} />)
        )}
      </div>
      <ChatInput onSend={onSend ?? (async () => undefined)} disabled={onSend === null} />
    </div>
  )
}
