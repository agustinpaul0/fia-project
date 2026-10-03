import type { Role } from '@fia/shared/domain'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { MainNav } from '@/app/main-nav'
import { UserNav } from '@/features/auth/components/user-nav'
import { HealthBadge } from '@/features/health/components/health-badge'
import { useSession } from '@/lib/auth-client'
import { FiaLogo } from './fia-logo'

const useRole = (): Role | null => {
  const { data: session } = useSession()
  if (!session) {
    return null
  }
  return session.user.role === 'fia_admin' || session.user.role === 'team_staff'
    ? session.user.role
    : 'public'
}

export const AppHeader = (): ReactNode => (
  <header className="sticky top-0 z-50 w-full border-outline border-b-2 bg-primary">
    <div className="flex min-h-16 w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 px-6 py-3 lg:px-8">
      <div className="flex min-w-0 flex-wrap items-center gap-x-6 gap-y-2">
        <Link to="/" className="flex items-center gap-3">
          <FiaLogo className="h-8 w-auto" />
          <span className="flex flex-col font-bold font-headline text-on-primary uppercase leading-tight tracking-wider 2xl:flex-row 2xl:gap-2 2xl:text-lg">
            <span className="text-base 2xl:text-lg">FIA</span>
            <span className="hidden 2xl:inline">—</span>
            <span className="text-[11px] text-surface-variant 2xl:text-lg 2xl:text-on-primary">
              Sistema de gestión
            </span>
          </span>
        </Link>
        <MainNav userRole={useRole()} />
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <HealthBadge />
        <UserNav />
      </div>
    </div>
  </header>
)
