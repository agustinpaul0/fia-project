import { TriangleAlert } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { toUserMessage } from '@/lib/to-user-message'

type ErrorStateProps = {
  readonly error: unknown
  readonly onRetry: (() => void) | null
}

export const ErrorState = ({ error, onRetry }: ErrorStateProps): ReactNode => (
  <div
    role="alert"
    className="flex border-2 border-outline bg-surface-container-lowest shadow-brutal"
  >
    <span className="w-2 shrink-0 bg-secondary" aria-hidden />
    <div className="flex flex-1 flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <TriangleAlert className="mt-0.5 size-5 shrink-0 text-secondary" aria-hidden />
        <div className="flex flex-col gap-1">
          <p className="font-bold font-label text-on-surface text-xs uppercase tracking-widest">
            No pudimos completar la operación
          </p>
          <p className="text-on-surface-variant text-sm">{toUserMessage(error)}</p>
        </div>
      </div>
      {onRetry === null ? null : (
        <Button variant="outline" size="sm" className="self-start sm:self-center" onClick={onRetry}>
          Reintentar
        </Button>
      )}
    </div>
  </div>
)
