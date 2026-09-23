import { Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { UserNav } from '@/features/auth/components/user-nav'
import { HealthBadge } from '@/features/health/components/health-badge'

export const RootLayout = (): ReactNode => (
  <div className="min-h-screen bg-background text-foreground">
    <header className="flex items-center justify-between border-b px-6 py-4">
      <h1 className="text-lg font-bold">FIA — Sistema de gestión</h1>
      <div className="flex items-center gap-4">
        <UserNav />
        <HealthBadge />
      </div>
    </header>
    <main className="mx-auto max-w-4xl p-6">
      <Outlet />
    </main>
    <Toaster richColors />
  </div>
)
