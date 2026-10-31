import { useQuery } from '@tanstack/react-query'
import { type ReactNode, useState } from 'react'
import { Button } from '@/components/ui/button'
import { FIELD_CLASS } from '@/features/team-staff/components/field-message'
import { CHAT_QUERY_KEYS, fetchContactsApi } from '../api/chat-api'
import { useCreateConversation } from '../hooks/use-chat'

type Props = { readonly onCreated: (conversationId: string) => void }

export const ChatNewConversation = ({ onCreated }: Props): ReactNode => {
  const { data: contacts = [] } = useQuery({
    queryKey: CHAT_QUERY_KEYS.contacts,
    queryFn: fetchContactsApi,
  })
  const create = useCreateConversation()
  const [recipientId, setRecipientId] = useState('')
  const start = async (): Promise<void> => {
    onCreated((await create.mutateAsync(recipientId)).id)
    setRecipientId('')
  }
  return (
    <div className="flex flex-col gap-2 border-outline border-b-2 pb-3">
      <label htmlFor="chat-recipient" className="font-bold font-mono text-xs uppercase">
        Nueva conversación
      </label>
      <select
        id="chat-recipient"
        value={recipientId}
        onChange={(e) => setRecipientId(e.target.value)}
        className={`${FIELD_CLASS} text-xs`}
      >
        <option value="">Elegí un destinatario...</option>
        {contacts.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name} —{' '}
            {c.role === 'driver' ? '✓ Piloto oficial' : (c.teamName ?? 'Administración FIA')}
          </option>
        ))}
      </select>
      <Button
        size="sm"
        variant="accent"
        disabled={recipientId === '' || create.isPending}
        onClick={() => void start().catch(() => undefined)}
      >
        Iniciar chat cifrado
      </Button>
      {create.error && (
        <p role="alert" className="text-secondary text-xs">
          {create.error.message}
        </p>
      )}
    </div>
  )
}
