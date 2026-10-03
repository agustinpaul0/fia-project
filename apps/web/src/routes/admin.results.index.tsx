import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { AdminResultsView } from '@/features/race-results/components/admin-results-view'

const AdminResultsPage = (): ReactNode => (
  <RequireFiaAdmin>
    <AdminResultsView />
  </RequireFiaAdmin>
)

export const Route = createFileRoute('/admin/results/')({ component: AdminResultsPage })
