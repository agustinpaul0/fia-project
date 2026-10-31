import type { DriverAccount } from '@fia/shared/contracts'
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
  readonly account: DriverAccount | null
  readonly onClose: () => void
  readonly onConfirm: (account: DriverAccount) => Promise<void>
}

export const DriverAccountDeactivateDialog = ({
  account,
  onClose,
  onConfirm,
}: Props): ReactNode => {
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const confirm = async (): Promise<void> => {
    if (!account) {
      return
    }
    setError(null)
    setLoading(true)
    try {
      await onConfirm(account)
      onClose()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'No se pudo dar de baja la cuenta.')
    } finally {
      setLoading(false)
    }
  }
  return (
    <AlertDialog open={account !== null} onOpenChange={(open) => (open ? undefined : onClose())}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Dar de baja cuenta de piloto</AlertDialogTitle>
          <AlertDialogDescription>
            {`¿Dar de baja la cuenta de ${account?.driverName ?? ''}? No podrá volver a iniciar sesión y su mail no se podrá reutilizar.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <AlertDialogFooter>
          <AlertDialogCancel className={buttonVariants({ variant: 'outline' })} onClick={onClose}>
            Cancelar
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={confirm}
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
