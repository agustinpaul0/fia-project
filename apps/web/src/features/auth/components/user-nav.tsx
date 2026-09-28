import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { NotificationsNavLink } from '@/features/notifications/components/notifications-nav-link'
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
      {role === 'fia_admin' && (
        <>
          <Link to="/admin/team-staff">
            <Button variant="ghost" size="sm">
              Personal
            </Button>
          </Link>
          <Link to="/admin/results">
            <Button variant="ghost" size="sm">
              Carga de resultados
            </Button>
          </Link>
          <Link to="/admin/notifications">
            <Button variant="ghost" size="sm">
              Confirmaciones
            </Button>
          </Link>
        </>
      )}
      {role === 'team_staff' && <NotificationsNavLink />}
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
