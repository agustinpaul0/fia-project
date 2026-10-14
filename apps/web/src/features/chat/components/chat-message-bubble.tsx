import { CheckCircle2 } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'

type Props = {
  readonly senderName: string
  readonly sentAt: string
  readonly content: string
  readonly isMine: boolean
}

export const ChatMessageBubble = ({ senderName, sentAt, content, isMine }: Props): ReactNode => (
  <div
    className={`flex flex-col gap-1 max-w-[80%] ${isMine ? 'self-end items-end' : 'self-start items-start'}`}
  >
    <div className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant">
      <span className="font-bold">{senderName}</span>
      <span>{formatDateTime(sentAt)}</span>
    </div>
    <div
      className={`border-2 border-black p-3 text-sm shadow-brutal-sm font-sans break-words ${
        isMine ? 'bg-primary text-on-primary font-medium' : 'bg-surface text-on-surface'
      }`}
    >
      {content}
    </div>
    <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-800">
      <CheckCircle2 className="size-3 text-emerald-700" />
      <span>Cifrado E2E & Firma verificada</span>
    </div>
  </div>
)
