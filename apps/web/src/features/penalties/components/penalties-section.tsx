import type { PenaltyType } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { useSession } from '@/lib/auth-client'
import { useCreatePenalty } from '../hooks/use-create-penalty'
import { usePenalties } from '../hooks/use-penalties'
import { PenaltiesFilters } from './penalties-filters'
import { PenaltiesList } from './penalties-list'
import { PenaltyCreateDialog } from './penalty-create-dialog'

export const PenaltiesSection = (): ReactNode => {
  const { data: session } = useSession()
  const isFiaAdmin = session?.user?.role === 'fia_admin'

  const [season, setSeason] = useState<number | undefined>(undefined)
  const [type, setType] = useState<PenaltyType | undefined>(undefined)
  const [dialogOpen, setDialogOpen] = useState(false)

  const query = usePenalties({ season, type })
  const createMut = useCreatePenalty()

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
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
          <Button variant="accent" className="shadow-brutal-sm" onClick={() => setDialogOpen(true)}>
            + Nueva sanción
          </Button>
        )}
      </div>

      <PenaltiesFilters
        selectedSeason={season}
        selectedType={type}
        onSeasonChange={setSeason}
        onTypeChange={setType}
      />

      <QueryView
        query={query}
        isEmpty={(items) => items.length === 0}
        emptyMessage="No se encontraron sanciones registradas para los filtros aplicados."
      >
        {(items) => <PenaltiesList penalties={items} />}
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
