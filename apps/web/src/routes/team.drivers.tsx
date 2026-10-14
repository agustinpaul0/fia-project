import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireTeamStaff } from '@/features/auth/guards/require-team-staff'
import { TeamDriversSection } from '@/features/team-drivers/components/team-drivers-section'

const TeamDriversPage = (): ReactNode => (
  <RequireTeamStaff>
    <TeamDriversSection />
  </RequireTeamStaff>
)

export const Route = createFileRoute('/team/drivers')({ component: TeamDriversPage })
