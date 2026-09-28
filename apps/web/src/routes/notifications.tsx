import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireTeamStaff } from '@/features/auth/guards/require-team-staff'
import { NotificationsInbox } from '@/features/notifications/components/notifications-inbox'

const NotificationsPage = (): ReactNode => (
  <RequireTeamStaff>
    <NotificationsInbox />
  </RequireTeamStaff>
)

export const Route = createFileRoute('/notifications')({ component: NotificationsPage })
