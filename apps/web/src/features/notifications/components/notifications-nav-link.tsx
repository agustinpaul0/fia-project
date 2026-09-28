import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useMyNotifications } from '../hooks/use-notifications'

export const NotificationsNavLink = (): ReactNode => {
  const pending = useMyNotifications().data?.length ?? 0
  return (
    <Link to="/notifications">
      <Button variant="ghost" size="sm" className="gap-2">
        Notificaciones
        {pending > 0 ? (
          <Badge variant="destructive" aria-label={`${pending} pendientes`}>
            {pending}
          </Badge>
        ) : null}
      </Button>
    </Link>
  )
}
