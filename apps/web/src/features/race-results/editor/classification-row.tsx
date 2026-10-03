import type { EligibleDriver } from '@fia/shared/contracts'
import { cn } from 'cn'
import type { ReactNode } from 'react'
import { pointsLabel, positionLabel } from './editor-summary'
import { RowControls } from './row-controls'

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

const leaderTone = (position: number): string =>
  position === 1
    ? 'bg-primary-container text-on-primary-container'
    : 'bg-surface-container-high text-primary'

const DriverPicker = (props: ClassificationRowProps): ReactNode => (
  <div className="flex min-w-0 flex-1 items-center gap-3">
    <div
      className={cn(
        'flex h-12 w-12 shrink-0 items-center justify-center border-2 border-primary font-bold font-headline text-2xl shadow-[2px_2px_0px_0px_#1a1a1a]',
        leaderTone(props.position),
      )}
    >
      {props.position}
    </div>
    <div className="min-w-0 flex-1">
      <span className="block font-bold font-headline text-[10px] text-on-surface-variant uppercase tracking-wider">
        {positionLabel(props.position)}
      </span>
      <select
        aria-label={`Piloto en la posición ${props.position}`}
        className="mt-0.5 w-full rounded-none border-primary border-b-2 bg-surface-container-lowest py-1.5 pr-8 pl-1 font-bold font-headline text-primary text-sm uppercase focus:bg-surface-container-low focus:outline-none"
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
    </div>
  </div>
)

export const ClassificationRow = (props: ClassificationRowProps): ReactNode => (
  <li className="flex flex-col items-stretch justify-between border-2 border-primary bg-surface-container-lowest p-2.5 shadow-[4px_4px_0px_0px_#1a1a1a] sm:p-3 md:flex-row md:items-center">
    <DriverPicker {...props} />
    <div className="mt-3 flex shrink-0 items-center justify-between gap-3 border-surface-container border-t-2 pt-2 md:mt-0 md:justify-end md:border-t-0 md:pt-0 md:pl-3">
      <span
        className={cn(
          'min-w-[76px] border-2 border-primary px-3 py-1.5 text-center font-bold font-headline text-xs uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a1a]',
          props.position === 1
            ? 'bg-primary-container text-on-primary-container'
            : 'bg-surface-container text-on-surface',
        )}
      >
        {pointsLabel(props.points)}
      </span>
      <RowControls
        position={props.position}
        isLast={props.isLast}
        onMove={props.onMove}
        onRemove={props.onRemove}
      />
    </div>
  </li>
)
