import type { Role } from '@fia/shared/domain'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { NAV_ACTIVE, NAV_INACTIVE, NAV_LINK_CLASS } from '@/components/brand/nav-link-props'
import { NotificationsNavLink } from '@/features/notifications/components/notifications-nav-link'

type NavTarget =
  | '/'
  | '/results'
  | '/sanctions'
  | '/scrutineering'
  | '/drivers'
  | '/admin/team-staff'
  | '/admin/drivers'
  | '/admin/results'
  | '/admin/notifications'
  | '/team/drivers'
  | '/driver'
  | '/chat'

type NavItem = { readonly to: NavTarget; readonly label: string }

const PUBLIC_LINKS: readonly NavItem[] = [
  { to: '/results', label: 'Resultados' },
  { to: '/sanctions', label: 'Sanciones' },
  { to: '/scrutineering', label: 'Técnica' },
  { to: '/drivers', label: 'Nómina' },
]

const ROLE_LINKS: Readonly<Record<Role, readonly NavItem[]>> = {
  fia_admin: [
    { to: '/admin/team-staff', label: 'Personal' },
    { to: '/admin/drivers', label: 'Cuentas de pilotos' },
    { to: '/admin/results', label: 'Carga de resultados' },
    { to: '/admin/notifications', label: 'Confirmaciones' },
    { to: '/chat', label: 'Mensajes' },
  ],
  team_staff: [
    { to: '/team/drivers', label: 'Pilotos' },
    { to: '/chat', label: 'Mensajes' },
  ],
  driver: [
    { to: '/driver', label: 'Mi panel' },
    { to: '/chat', label: 'Mensajes' },
  ],
  public: [],
}

const NavLink = ({ to, label }: NavItem): ReactNode => (
  <Link
    to={to}
    className={NAV_LINK_CLASS}
    activeProps={NAV_ACTIVE}
    inactiveProps={NAV_INACTIVE}
    activeOptions={{ exact: to === '/' }}
  >
    {label}
  </Link>
)

export const MainNav = ({ userRole }: { readonly userRole: Role | null }): ReactNode => (
  <nav aria-label="Principal" className="flex items-center gap-2 overflow-x-auto">
    <NavLink to="/" label="Inicio" />
    {PUBLIC_LINKS.map((item) => (
      <NavLink key={item.to} {...item} />
    ))}
    {(userRole === null ? [] : ROLE_LINKS[userRole]).map((item) => (
      <NavLink key={item.to} {...item} />
    ))}
    {userRole === 'team_staff' ? <NotificationsNavLink /> : null}
  </nav>
)
