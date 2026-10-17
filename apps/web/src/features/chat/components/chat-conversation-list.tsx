import type { ChatConversation } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { ChatConversationItem } from './chat-conversation-item'

export interface ChatConversationListProps {
  readonly isLoading: boolean
  readonly conversations: readonly ChatConversation[]
  readonly selectedId: string | null
  readonly onSelect: (id: string) => void
}

export const ChatConversationList = ({
  isLoading,
  conversations,
  selectedId,
  onSelect,
}: ChatConversationListProps): ReactNode => {
  if (isLoading) {
    return <div className="font-mono text-xs text-on-surface-variant p-4">Cargando chats...</div>
  }
  if (conversations.length === 0) {
    return (
      <div className="font-mono text-xs text-on-surface-variant p-4 text-center">
        No tenés conversaciones iniciadas.
      </div>
    )
  }
  return (
    <div className="flex flex-col gap-2">
      {conversations.map((conv) => (
        <ChatConversationItem
          key={conv.id}
          conversation={conv}
          isSelected={conv.id === selectedId}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}
