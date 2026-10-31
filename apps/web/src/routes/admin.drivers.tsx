import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { DriverAccountsSection } from '@/features/driver-accounts/components/driver-accounts-section'

const AdminDriversPage = (): ReactNode => (
  <RequireFiaAdmin>
    <DriverAccountsSection />
  </RequireFiaAdmin>
)

export const Route = createFileRoute('/admin/drivers')({ component: AdminDriversPage })
