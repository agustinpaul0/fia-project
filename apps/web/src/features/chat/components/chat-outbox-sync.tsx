import type { ReactNode } from 'react'
import { useSession } from '@/lib/auth-client'
import { useOutboxSync } from '../hooks/use-outbox-sync'

const CHAT_ROLES: readonly (string | null | undefined)[] = ['fia_admin', 'team_staff']

export const ChatOutboxSync = (): ReactNode => {
  const { data: session } = useSession()
  useOutboxSync(CHAT_ROLES.includes(session?.user?.role))
  return null
}
