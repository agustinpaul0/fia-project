import type { Penalty } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { toast } from 'sonner'
import { QueryView } from '@/components/common/query-view'
import { Button } from '@/components/ui/button'
import { PenaltyTypeBadge } from '@/features/penalties/components/penalty-type-badge'
import { useConfirmPenalty } from '@/features/penalties/hooks/use-confirm-penalty'
import { usePendingPenalties } from '@/features/penalties/hooks/use-pending-penalties'
import { formatDateTime } from '@/lib/format-date-time'

export const NO_PENDING_PENALTIES = 'No tenés sanciones pendientes de confirmar.'

const PenaltyNotice = ({
  penalty,
  onConfirm,
  confirming,
}: {
  readonly penalty: Penalty
  readonly onConfirm: () => void
  readonly confirming: boolean
}): ReactNode => (
  <article className="flex flex-col gap-2 border-4 border-secondary bg-surface-container-lowest p-5 shadow-[6px_6px_0px_0px_#1a1a1a]">
    <div className="flex flex-wrap items-center gap-2">
      <PenaltyTypeBadge type={penalty.type} />
      <span className="font-mono text-on-surface-variant text-xs">
        {formatDateTime(penalty.issuedAt)}
      </span>
    </div>
    <p className="font-bold font-headline text-lg">
      {penalty.penalty} — {penalty.driverName ?? `${penalty.teamName} (Escudería)`}
    </p>
    <p className="text-on-surface-variant text-sm">{penalty.reason}</p>
    <Button variant="accent" className="self-start" disabled={confirming} onClick={onConfirm}>
      {confirming ? 'Confirmando...' : 'Confirmar recepción'}
    </Button>
  </article>
)

export const PendingPenaltiesPanel = (): ReactNode => {
  const query = usePendingPenalties()
  const confirm = useConfirmPenalty()
  return (
    <section className="flex flex-col gap-4">
      <h2 className="font-bold font-headline text-2xl text-primary uppercase">
        Sanciones a confirmar
      </h2>
      <QueryView query={query} isEmpty={(l) => l.length === 0} emptyMessage={NO_PENDING_PENALTIES}>
        {(list) => (
          <ul className="grid grid-cols-1 gap-4">
            {list.map((p) => (
              <li key={p.id}>
                <PenaltyNotice
                  penalty={p}
                  confirming={confirm.isPending && confirm.variables === p.id}
                  onConfirm={() =>
                    confirm.mutate(p.id, {
                      onSuccess: () =>
                        toast.success('Quedó registrado que tu escudería recibió la sanción.'),
                    })
                  }
                />
              </li>
            ))}
          </ul>
        )}
      </QueryView>
    </section>
  )
}
