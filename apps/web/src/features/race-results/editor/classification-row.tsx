import type { EligibleDriver } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'

export type ClassificationRowProps = {
  readonly position: number
  readonly points: number
  readonly driverId: string
  readonly options: readonly EligibleDriver[]
  readonly isLast: boolean
  readonly onChoose: (driverId: string) => void
  readonly onMove: (offset: -1 | 1) => void
  readonly onRemove: () => void
}

export const ClassificationRow = (props: ClassificationRowProps): ReactNode => (
  <li className="flex items-center gap-2">
    <span className="w-8 text-right font-medium">{props.position}</span>
    <select
      aria-label={`Piloto en la posición ${props.position}`}
      className="flex-1 rounded-md border bg-background px-2 py-1"
      value={props.driverId}
      onChange={(event) => props.onChoose(event.target.value)}
    >
      <option value="">Elegí un piloto</option>
      {props.options.map((driver) => (
        <option key={driver.id} value={driver.id}>
          {driver.code} — {driver.name} ({driver.teamName})
        </option>
      ))}
    </select>
    <span className="w-16 text-right text-sm">{props.points} pts</span>
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Subir la posición ${props.position}`}
      disabled={props.position === 1}
      onClick={() => props.onMove(-1)}
    >
      ↑
    </Button>
    <Button
      type="button"
      variant="outline"
      size="sm"
      aria-label={`Bajar la posición ${props.position}`}
      disabled={props.isLast}
      onClick={() => props.onMove(1)}
    >
      ↓
    </Button>
    <Button
      type="button"
      variant="ghost"
      size="sm"
      aria-label={`Quitar la posición ${props.position}`}
      onClick={props.onRemove}
    >
      ✕
    </Button>
  </li>
)
