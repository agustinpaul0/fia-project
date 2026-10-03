import type { EligibleDriver, RaceClassification } from '@fia/shared/contracts'
import { pointsFor } from '@fia/shared/domain'
import { Flag } from 'lucide-react'
import type { FormEvent, ReactNode } from 'react'
import { useSaveRaceClassification } from '../hooks/use-save-race-classification'
import { driverIdsOf, isComplete } from './classification-draft'
import { ClassificationRow } from './classification-row'
import { AddDriverButton, EditorActions } from './editor-actions'
import { totalAssigned } from './editor-summary'
import { useClassificationDraft } from './use-classification-draft'

type Props = {
  readonly classification: RaceClassification
  readonly drivers: readonly EligibleDriver[]
}

const StripBar = (): ReactNode => (
  <div className="flex flex-wrap items-center justify-between gap-4 border-2 border-primary bg-primary px-4 py-3 text-on-primary">
    <div className="flex items-center gap-3">
      <Flag className="size-6 text-primary-container" aria-hidden />
      <span className="font-bold font-headline text-sm uppercase tracking-wider">
        Orden de posiciones y puntos de campeonato
      </span>
    </div>
    <span className="hidden font-headline font-semibold text-surface-variant text-xs uppercase md:inline">
      Los puntos se calculan solos según la posición
    </span>
  </div>
)

export const ClassificationEditor = ({ classification, drivers }: Props): ReactNode => {
  const { race } = classification
  const draft = useClassificationDraft(classification.results.map((result) => result.driverId))
  const save = useSaveRaceClassification()
  const driverIds = driverIdsOf(draft.rows)
  const chosen = new Set(driverIds)
  const submit = (event: FormEvent): void => {
    event.preventDefault()
    const entries = driverIds.map((driverId) => ({ driverId }))
    save.mutate({ raceId: race.id, body: { version: race.version, entries } })
  }
  return (
    <form onSubmit={submit} className="space-y-6">
      <StripBar />
      <ol className="space-y-2.5">
        {draft.rows.map(({ key, driverId }, index) => (
          <ClassificationRow
            key={key}
            position={index + 1}
            points={pointsFor(race.type, index + 1)}
            driverId={driverId}
            options={drivers.filter((d) => d.id === driverId || !chosen.has(d.id))}
            isLast={index === draft.rows.length - 1}
            onChoose={(id) => draft.choose(index, id)}
            onMove={(offset) => draft.move(index, offset)}
            onRemove={() => draft.remove(index)}
          />
        ))}
      </ol>
      <AddDriverButton disabled={draft.rows.length >= drivers.length} onAdd={draft.add} />
      <EditorActions
        classified={draft.rows.length}
        eligible={drivers.length}
        total={totalAssigned(race.type, draft.rows.length)}
        canSave={isComplete(draft.rows)}
        isSaving={save.isPending}
        showIncomplete={draft.rows.length > 0 && !isComplete(draft.rows)}
        onCancel={draft.reset}
      />
    </form>
  )
}
