import type { RaceSummary } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { toast } from 'sonner'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button, buttonVariants } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useCancelRace, useCircuits, useUpdateRace } from '../hooks/use-race-schedule'
import { RaceScheduleForm } from './race-schedule-form'

export const CANCELLED_NOTICE =
  'Este evento fue dado de baja: ya no se puede modificar ni cargar su resultado.'

const CancelConfirm = ({
  race,
  open,
  onOpenChange,
}: {
  readonly race: RaceSummary
  readonly open: boolean
  readonly onOpenChange: (open: boolean) => void
}): ReactNode => {
  const cancel = useCancelRace()
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dar de baja el evento</AlertDialogTitle>
          <AlertDialogDescription>
            {`¿Dar de baja "${race.name}"? Seguirá en el calendario marcado como Cancelado.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: 'outline' })}>
            Volver
          </AlertDialogCancel>
          <AlertDialogAction
            className={buttonVariants({ variant: 'danger' })}
            onClick={() =>
              cancel.mutate(
                { raceId: race.id, body: { version: race.version } },
                { onSuccess: () => toast.success('Evento dado de baja.') },
              )
            }
          >
            Confirmar baja
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export const RaceScheduleActions = ({ race }: { readonly race: RaceSummary }): ReactNode => {
  const [editing, setEditing] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const circuits = useCircuits().data ?? []
  const update = useUpdateRace()
  if (race.status === 'cancelled') {
    return (
      <p className="border-2 border-secondary bg-red-50 px-4 py-3 font-bold text-red-900 text-sm">
        {CANCELLED_NOTICE}
      </p>
    )
  }
  return (
    <div className="flex flex-wrap gap-2">
      <Button variant="outline" onClick={() => setEditing(true)}>
        Modificar evento
      </Button>
      <Button variant="danger" onClick={() => setCancelling(true)}>
        Dar de baja
      </Button>
      <Dialog open={editing} onOpenChange={setEditing}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Modificar evento</DialogTitle>
          </DialogHeader>
          <RaceScheduleForm
            race={race}
            circuits={circuits}
            onCancel={() => setEditing(false)}
            onSubmit={async (body) => {
              await update.mutateAsync({ raceId: race.id, body })
              toast.success('Evento modificado. El calendario muestra el cambio.')
              setEditing(false)
            }}
          />
        </DialogContent>
      </Dialog>
      <CancelConfirm race={race} open={cancelling} onOpenChange={setCancelling} />
    </div>
  )
}
