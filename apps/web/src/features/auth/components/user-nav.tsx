import { Link } from '@tanstack/react-router'
import { LogOut, UserRound } from 'lucide-react'
import type { ReactNode } from 'react'
import { signOut, useSession } from '@/lib/auth-client'

const LIGHT_BUTTON =
  'flex items-center gap-2 border-2 border-surface-variant px-3 py-1 font-bold font-label text-[11px] text-on-primary uppercase tracking-wider transition-colors'

const LoginLink = (): ReactNode => (
  <Link to="/login" className={`${LIGHT_BUTTON} hover:bg-primary-container hover:text-primary`}>
    <UserRound className="size-4" aria-hidden />
    Iniciar sesión
  </Link>
)

export const UserNav = (): ReactNode => {
  const { data: session } = useSession()
  if (!session) {
    return <LoginLink />
  }
  const role = session.user.role ?? 'public'
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-1.5 border-2 border-outline bg-primary-container px-3 py-1 font-bold font-label text-[11px] text-primary uppercase tracking-wider">
        <span className="hidden whitespace-nowrap 2xl:inline">{session.user.name}</span>
        <span className="whitespace-nowrap">
          [ <span className="normal-case">{role}</span> ]
        </span>
      </div>
      <button
        type="button"
        className={`${LIGHT_BUTTON} hover:border-secondary hover:bg-secondary`}
        onClick={() => {
          void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })
        }}
      >
        <LogOut className="size-3.5" aria-hidden />
        Salir
      </button>
    </div>
  )
}
