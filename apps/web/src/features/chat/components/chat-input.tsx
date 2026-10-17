import { Send } from 'lucide-react'
import { type FormEvent, type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly onSend: (text: string) => Promise<void>
  readonly disabled?: boolean
}

export const ChatInput = ({ onSend, disabled = false }: Props): ReactNode => {
  const [text, setText] = useState('')
  const [sending, setSending] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!text.trim() || sending) {
      return
    }
    setSending(true)
    const sent = await onSend(text.trim()).then(
      () => true,
      () => false,
    )
    setSending(false)
    if (sent) {
      setText('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 p-3 border-t-2 border-black bg-surface">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Escribí un mensaje cifrado de extremo a extremo..."
        disabled={disabled || sending}
        className={`${FIELD_CLASS} flex-1 text-sm`}
      />
      <Button
        type="submit"
        variant="accent"
        disabled={disabled || sending || !text.trim()}
        className="shadow-brutal-sm gap-1.5"
      >
        <Send className="size-4" />
        <span className="hidden sm:inline">Enviar</span>
      </Button>
    </form>
  )
}
