import type { TeamStaff } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
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
import { buttonVariants } from '@/components/ui/button'

type Props = {
  readonly member: TeamStaff | null
  readonly onOpenChange: (open: boolean) => void
  readonly onConfirm: (id: string, version: number) => Promise<void>
}

export const TeamStaffDeactivateDialog = ({
  member,
  onOpenChange,
  onConfirm,
}: Props): ReactNode => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConfirm = async (): Promise<void> => {
    if (!member) {
      return
    }
    setError(null)
    setLoading(true)
    try {
      await onConfirm(member.id, member.version)
      onOpenChange(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al dar de baja el integrante')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AlertDialog open={member !== null} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dar de baja cuenta de personal</AlertDialogTitle>
          <AlertDialogDescription>
            {`¿Estás seguro de que deseás dar de baja la cuenta de ${member?.firstName} ${member?.lastName} (Legajo: ${member?.fileNumber})?`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <p className="border-2 border-secondary bg-secondary-container px-3 py-2 text-on-error-container text-xs">
          Esta acción revocará su acceso al sistema de forma inmediata. La baja es permanente y no
          se podrá volver a reactivar; los datos históricos y registros quedarán preservados.
        </p>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel
            className={buttonVariants({ variant: 'outline' })}
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            disabled={loading}
            className={buttonVariants({ variant: 'danger' })}
          >
            {loading ? 'Dando de baja...' : 'Confirmar baja'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
