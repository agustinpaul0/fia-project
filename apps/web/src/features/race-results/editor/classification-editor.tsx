import type { EligibleDriver, RaceClassification } from '@fia/shared/contracts'
import { pointsFor } from '@fia/shared/domain'
import type { FormEvent, ReactNode } from 'react'
import { useSaveRaceClassification } from '../hooks/use-save-race-classification'
import { driverIdsOf, isComplete } from './classification-draft'
import { ClassificationRow } from './classification-row'
import { EditorActions } from './editor-actions'
import { useClassificationDraft } from './use-classification-draft'

type Props = {
  readonly classification: RaceClassification
  readonly drivers: readonly EligibleDriver[]
}

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
    <form onSubmit={submit} className="flex flex-col gap-4">
      <ol className="flex flex-col gap-2">
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
      <EditorActions
        canAdd={draft.rows.length < drivers.length}
        canSave={isComplete(draft.rows)}
        isSaving={save.isPending}
        showIncomplete={draft.rows.length > 0 && !isComplete(draft.rows)}
        onAdd={draft.add}
      />
    </form>
  )
}
