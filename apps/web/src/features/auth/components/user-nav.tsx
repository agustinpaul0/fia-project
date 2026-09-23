import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { signOut, useSession } from '@/lib/auth-client'

export const UserNav = (): ReactNode => {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Link to="/login">
        <Button variant="outline" size="sm">
          Iniciar sesión
        </Button>
      </Link>
    )
  }

  const role = session.user.role ?? 'public'
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-medium">{session.user.name}</span>
      <Badge variant="outline">{role}</Badge>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => {
          void signOut({ fetchOptions: { onSuccess: () => window.location.reload() } })
        }}
      >
        Salir
      </Button>
    </div>
  )
}
