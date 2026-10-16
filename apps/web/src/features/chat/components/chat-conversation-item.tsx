import type { ChatConversation } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

type Props = {
  readonly conversation: ChatConversation
  readonly isSelected: boolean
  readonly onSelect: (id: string) => void
}

export const ChatConversationItem = ({ conversation, isSelected, onSelect }: Props): ReactNode => (
  <button
    type="button"
    onClick={() => onSelect(conversation.id)}
    className={`w-full text-left p-3 border-2 border-black transition-all ${
      isSelected
        ? 'bg-primary text-on-primary font-bold shadow-brutal-sm translate-x-1'
        : 'bg-surface hover:bg-surface-container-low text-on-surface'
    }`}
  >
    <div className="flex justify-between items-start">
      <span className="font-headline font-bold text-sm truncate">{conversation.otherUserName}</span>
      <span className="font-mono text-[10px] uppercase opacity-75">
        {conversation.otherUserRole === 'fia_admin' ? 'FIA Admin' : 'Escudería'}
      </span>
    </div>
    {conversation.otherTeamName && (
      <div className="font-mono text-xs opacity-90 truncate mt-0.5">
        {conversation.otherTeamName}
      </div>
    )}
  </button>
)
