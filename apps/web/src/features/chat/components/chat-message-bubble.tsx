import { CheckCircle2, Clock, ShieldAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { formatDateTime } from '@/lib/format-date-time'
import type { DecryptedMessage } from '../hooks/use-chat-crypto'

export const UNVERIFIED_MESSAGE =
  'No se pudo verificar este mensaje: la firma no coincide o las claves cambiaron.'

export const PENDING_LABEL = 'Pendiente de envío: se manda al volver la conexión'

export const ChatMessageBubble = ({
  message,
}: {
  readonly message: DecryptedMessage
}): ReactNode => (
  <div
    className={`flex flex-col gap-1 max-w-[80%] ${message.isMine ? 'self-end items-end' : 'self-start items-start'}`}
  >
    <div className="flex items-center gap-2 font-mono text-[11px] text-on-surface-variant">
      <span className="font-bold">{message.senderName}</span>
      <span>{formatDateTime(message.sentAt)}</span>
    </div>
    {message.text === null ? (
      <div
        role="alert"
        className="flex items-center gap-2 border-2 border-red-700 bg-red-50 p-3 text-red-900 text-sm"
      >
        <ShieldAlert className="size-4" />
        <span>{UNVERIFIED_MESSAGE}</span>
      </div>
    ) : (
      <>
        <div
          className={`border-2 border-black p-3 text-sm shadow-brutal-sm font-sans break-words ${
            message.isMine ? 'bg-primary text-on-primary font-medium' : 'bg-surface text-on-surface'
          }`}
        >
          {message.text}
        </div>
        {message.pending ? (
          <div className="flex items-center gap-1 font-mono text-[10px] text-amber-800">
            <Clock className="size-3" />
            <span>{PENDING_LABEL}</span>
          </div>
        ) : (
          <div className="flex items-center gap-1 font-mono text-[10px] text-emerald-800">
            <CheckCircle2 className="size-3 text-emerald-700" />
            <span>Cifrado E2E y firma verificada</span>
          </div>
        )}
      </>
    )}
  </div>
)
