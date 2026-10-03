import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { NAV_ACTIVE, NAV_INACTIVE, NAV_LINK_CLASS } from '@/components/brand/nav-link-props'
import { useMyNotifications } from '../hooks/use-notifications'

export const NotificationsNavLink = (): ReactNode => {
  const pending = useMyNotifications().data?.length ?? 0
  return (
    <Link
      to="/notifications"
      className={NAV_LINK_CLASS}
      activeProps={NAV_ACTIVE}
      inactiveProps={NAV_INACTIVE}
    >
      Notificaciones
      {pending > 0 ? (
        <>
          <span aria-hidden>{` (${pending})`}</span>
          <span className="sr-only">{`${pending} pendientes`}</span>
        </>
      ) : null}
    </Link>
  )
}
