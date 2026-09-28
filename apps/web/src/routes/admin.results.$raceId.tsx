import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { AdminRaceEditor } from '@/features/race-results/components/admin-race-editor'

const AdminRaceResultPage = (): ReactNode => {
  const { raceId } = Route.useParams()
  return (
    <RequireFiaAdmin>
      <AdminRaceEditor raceId={raceId} />
    </RequireFiaAdmin>
  )
}

export const Route = createFileRoute('/admin/results/$raceId')({ component: AdminRaceResultPage })
