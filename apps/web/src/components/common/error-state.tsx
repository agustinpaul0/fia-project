import type { ReactNode } from 'react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { toUserMessage } from '@/lib/to-user-message'

type ErrorStateProps = {
  readonly error: unknown
  readonly onRetry: (() => void) | null
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps): ReactNode => (
  <Alert variant="destructive">
    <AlertTitle>No pudimos completar la operación</AlertTitle>
    <AlertDescription className="flex flex-col items-start gap-3">
      <span>{toUserMessage(error)}</span>
      {onRetry === null ? null : (
        <Button variant="outline" size="sm" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </AlertDescription>
  </Alert>
)
