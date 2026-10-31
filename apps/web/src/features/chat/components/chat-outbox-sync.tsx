import { CHAT_ROLES } from '@fia/shared/domain'
import type { ReactNode } from 'react'
import { useSession } from '@/lib/auth-client'
import { useOutboxSync } from '../hooks/use-outbox-sync'

const CHAT_ROLE_LIST: readonly (string | null | undefined)[] = CHAT_ROLES

export const ChatOutboxSync = (): ReactNode => {
  const { data: session } = useSession()
  useOutboxSync(CHAT_ROLE_LIST.includes(session?.user?.role))
  return null
}
