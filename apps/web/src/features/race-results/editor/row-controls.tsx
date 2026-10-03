import { ArrowDown, ArrowUp, X } from 'lucide-react'
import type { ReactNode } from 'react'
import { RowButton } from './row-button'

type Props = {
  readonly position: number
  readonly isLast: boolean
  readonly onMove: (offset: -1 | 1) => void
  readonly onRemove: () => void
}

export const RowControls = ({ position, isLast, onMove, onRemove }: Props): ReactNode => (
  <div className="flex items-center gap-1.5">
    <RowButton
      label={`Subir la posición ${position}`}
      disabled={position === 1}
      onClick={() => onMove(-1)}
    >
      <ArrowUp className="size-[18px]" aria-hidden />
    </RowButton>
    <RowButton label={`Bajar la posición ${position}`} disabled={isLast} onClick={() => onMove(1)}>
      <ArrowDown className="size-[18px]" aria-hidden />
    </RowButton>
    <RowButton label={`Quitar la posición ${position}`} danger onClick={onRemove}>
      <X className="size-[18px]" aria-hidden />
    </RowButton>
  </div>
)
