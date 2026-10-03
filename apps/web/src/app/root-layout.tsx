import { Outlet } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { AppFooter } from '@/components/brand/app-footer'
import { AppHeader } from '@/components/brand/app-header'
import { Toaster } from '@/components/ui/sonner'

export const RootLayout = (): ReactNode => (
  <div className="flex min-h-screen flex-col bg-surface font-body text-on-surface">
    <AppHeader />
    <main className="flex w-full flex-1 flex-col bg-surface">
      <Outlet />
    </main>
    <AppFooter />
    <Toaster richColors />
  </div>
)
