import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { TeamStaffSection } from '@/features/team-staff/components/team-staff-section'

const AdminTeamStaffPage = (): ReactNode => (
  <RequireFiaAdmin>
    <TeamStaffSection />
  </RequireFiaAdmin>
)

export const Route = createFileRoute('/admin/team-staff')({
  component: AdminTeamStaffPage,
})
