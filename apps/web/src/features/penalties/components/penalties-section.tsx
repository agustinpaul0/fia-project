import type { PenaltyType } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { EMPTY_FILTERS_MESSAGE } from '@/components/common/data-filters-bar'
import { QueryView } from '@/components/common/query-view'
import { useCommonFilters } from '@/components/common/use-common-filters'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import { useConfirmPenalty } from '../hooks/use-confirm-penalty'
import { useCreatePenalty } from '../hooks/use-create-penalty'
import { usePenalties } from '../hooks/use-penalties'
import { PenaltiesFilters } from './penalties-filters'
import { PenaltiesList } from './penalties-list'
import { PenaltyCreateDialog } from './penalty-create-dialog'

const PenaltiesHeader = ({
  isFiaAdmin,
  onOpenCreate,
}: {
  readonly isFiaAdmin: boolean
  readonly onOpenCreate: () => void
}): ReactNode => (
  <div className="flex flex-col justify-between gap-4 border-2 border-black bg-surface p-6 shadow-brutal sm:flex-row sm:items-center">
    <div>
      <h1 className="font-bold font-headline text-2xl text-on-surface uppercase tracking-wide">
        Registro Oficial de Sanciones
      </h1>
      <p className="font-mono text-on-surface-variant text-sm">
        Histórico y penalizaciones disciplinarias aplicadas a escuderías y pilotos.
      </p>
    </div>
    {isFiaAdmin && (
      <Button variant="accent" className="shadow-brutal-sm" onClick={onOpenCreate}>
        + Nueva sanción
      </Button>
    )}
  </div>
)

export const PenaltiesSection = (): ReactNode => {
  const { data: session } = useSession()
  const isFiaAdmin = session?.user?.role === 'fia_admin'
  const isTeamStaff = session?.user?.role === 'team_staff'
  const filters = useCommonFilters({ season: new Date().getFullYear() })
  const [type, setType] = useState<PenaltyType | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)

  const query = usePenalties({ ...filters.query, type })
  const createMut = useCreatePenalty()
  const confirmMut = useConfirmPenalty()

  const handleConfirm = isTeamStaff
    ? async (id: string) => {
        await confirmMut.mutateAsync(id)
        toast.success('Notificación de sanción confirmada.')
      }
    : undefined

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
      <PenaltiesHeader isFiaAdmin={isFiaAdmin} onOpenCreate={() => setDialogOpen(true)} />
      <PenaltiesFilters filters={filters} selectedType={type} onTypeChange={setType} />
      <QueryView
        query={query}
        isEmpty={(items) => items.length === 0}
        emptyMessage={EMPTY_FILTERS_MESSAGE}
      >
        {(items) => <PenaltiesList penalties={items} onConfirm={handleConfirm} />}
      </QueryView>
      {isFiaAdmin && (
        <PenaltyCreateDialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          onSubmit={async (data) => {
            await createMut.mutateAsync(data)
            toast.success('Sanción registrada exitosamente.')
          }}
        />
      )}
    </div>
  )
}
