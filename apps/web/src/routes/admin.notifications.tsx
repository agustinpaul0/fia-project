import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { NotificationsAudit } from '@/features/notifications/components/notifications-audit'

const AdminNotificationsPage = (): ReactNode => (
  <RequireFiaAdmin>
    <NotificationsAudit />
  </RequireFiaAdmin>
)

export const Route = createFileRoute('/admin/notifications')({ component: AdminNotificationsPage })
