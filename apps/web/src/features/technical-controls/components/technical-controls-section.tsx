import type { TechnicalControlStatus, TechnicalControlType } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import { useCreateTechnicalControl } from '../hooks/use-create-technical-control'
import { useTechnicalControls } from '../hooks/use-technical-controls'
import { TechnicalControlCreateDialog } from './technical-control-create-dialog'
import { TechnicalControlsFilters } from './technical-controls-filters'
import { TechnicalControlsTable } from './technical-controls-table'

type HeaderProps = {
  readonly isFiaAdmin: boolean
  readonly isTeamStaff: boolean
  readonly onlyMine: boolean
  readonly onToggleMine: () => void
  readonly onOpenCreate: () => void
}

const TechnicalControlsHeader = (p: HeaderProps): ReactNode => (
  <div className="flex flex-col justify-between gap-4 border-2 border-black bg-surface p-6 shadow-brutal sm:flex-row sm:items-center">
    <div>
      <h1 className="font-bold font-headline text-2xl text-on-surface uppercase tracking-wide">
        Controles Técnicos Oficiales
      </h1>
      <p className="font-mono text-on-surface-variant text-sm">
        Registro y dictamen de verificaciones técnicas reglamentarias por vehículo y evento.
      </p>
    </div>
    <div className="flex items-center gap-2">
      {p.isTeamStaff && (
        <Button
          variant={p.onlyMine ? 'accent' : 'outline'}
          className="shadow-brutal-sm"
          onClick={p.onToggleMine}
        >
          {p.onlyMine ? 'Ver todos los controles' : 'Mis Autos'}
        </Button>
      )}
      {p.isFiaAdmin && (
        <Button variant="accent" className="shadow-brutal-sm" onClick={p.onOpenCreate}>
          + Nuevo control técnico
        </Button>
      )}
    </div>
  </div>
)

export const TechnicalControlsSection = (): ReactNode => {
  const { data: session } = useSession()
  const isFiaAdmin = session?.user?.role === 'fia_admin'
  const isTeamStaff = session?.user?.role === 'team_staff'
  const [season, setSeason] = useState<number | undefined>(undefined)
  const [controlType, setControlType] = useState<TechnicalControlType | undefined>(undefined)
  const [status, setStatus] = useState<TechnicalControlStatus | undefined>(undefined)
  const [onlyMine, setOnlyMine] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)

  const query = useTechnicalControls({ season, controlType, status }, isTeamStaff && onlyMine)
  const createMut = useCreateTechnicalControl()
  const emptyMsg = onlyMine
    ? 'Tu escudería no posee controles técnicos registrados.'
    : 'No se encontraron controles técnicos registrados para los filtros aplicados.'

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <TechnicalControlsHeader
        isFiaAdmin={isFiaAdmin}
        isTeamStaff={isTeamStaff}
        onlyMine={onlyMine}
        onToggleMine={() => setOnlyMine((p) => !p)}
        onOpenCreate={() => setDialogOpen(true)}
      />
      <TechnicalControlsFilters
        selectedSeason={season}
        selectedControlType={controlType}
        selectedStatus={status}
        onSeasonChange={setSeason}
        onControlTypeChange={setControlType}
        onStatusChange={setStatus}
      />
      <QueryView query={query} isEmpty={(items) => items.length === 0} emptyMessage={emptyMsg}>
        {(items) => <TechnicalControlsTable controls={items} />}
      </QueryView>
      {isFiaAdmin && (
        <TechnicalControlCreateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={async (data) => {
            await createMut.mutateAsync(data)
            toast.success('Control técnico registrado exitosamente.')
          }}
        />
      )}
    </div>
  )
}
