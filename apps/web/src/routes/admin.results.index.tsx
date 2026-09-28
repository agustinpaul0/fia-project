import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireFiaAdmin } from '@/features/auth/guards/require-fia-admin'
import { SeasonRacesPanel } from '@/features/race-results/components/season-races-panel'

const AdminResultsPage = (): ReactNode => (
  <RequireFiaAdmin>
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Carga de resultados</h2>
      <p className="text-sm text-muted-foreground">
        Elegí una carrera para cargar o corregir su clasificación.
      </p>
      <SeasonRacesPanel target="admin" />
    </div>
  </RequireFiaAdmin>
)

export const Route = createFileRoute('/admin/results/')({ component: AdminResultsPage })
