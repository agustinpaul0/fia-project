import type { Role } from '@fia/shared/domain'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { NAV_ACTIVE, NAV_INACTIVE, NAV_LINK_CLASS } from '@/components/brand/nav-link-props'
import { NotificationsNavLink } from '@/features/notifications/components/notifications-nav-link'

const ADMIN_LINKS = [
  { to: '/admin/team-staff', label: 'Personal' },
  { to: '/admin/results', label: 'Carga de resultados' },
  { to: '/admin/notifications', label: 'Confirmaciones' },
] as const

const AdminLinks = (): ReactNode =>
  ADMIN_LINKS.map((link) => (
    <Link
      key={link.to}
      to={link.to}
      className={NAV_LINK_CLASS}
      activeProps={NAV_ACTIVE}
      inactiveProps={NAV_INACTIVE}
    >
      {link.label}
    </Link>
  ))

export const MainNav = ({ userRole }: { readonly userRole: Role | null }): ReactNode => (
  <nav aria-label="Principal" className="flex items-center gap-2 overflow-x-auto">
    <Link
      to="/"
      className={NAV_LINK_CLASS}
      activeProps={NAV_ACTIVE}
      inactiveProps={NAV_INACTIVE}
      activeOptions={{ exact: true }}
    >
      Inicio
    </Link>
    <Link
      to="/results"
      className={NAV_LINK_CLASS}
      activeProps={NAV_ACTIVE}
      inactiveProps={NAV_INACTIVE}
    >
      Resultados
    </Link>
    {userRole === 'fia_admin' ? <AdminLinks /> : null}
    {userRole === 'team_staff' ? <NotificationsNavLink /> : null}
  </nav>
)
