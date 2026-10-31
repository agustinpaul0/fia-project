import type { CircuitOption, RaceSummary, UpdateRaceBody } from '@fia/shared/contracts'
import { type ReactNode, useState } from 'react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { DialogFooter } from '@/components/ui/dialog'
import { FormField } from '@/features/team-staff/components/form-field'
import { fromArgentinaLocalInput, toArgentinaLocalInput } from '@/lib/argentina-day'
import { RaceScheduleFields } from './race-schedule-fields'

type Props = {
  readonly race: RaceSummary
  readonly circuits: readonly CircuitOption[]
  readonly onCancel: () => void
  readonly onSubmit: (body: UpdateRaceBody) => Promise<void>
}

export const INVALID_DATE_MESSAGE = 'Ingresá una fecha y hora válidas.'

const useScheduleDraft = (race: RaceSummary, onSubmit: Props['onSubmit']) => {
  const [name, setName] = useState(race.name)
  const [when, setWhen] = useState(toArgentinaLocalInput(race.date))
  const [type, setType] = useState(race.type)
  const [circuitId, setCircuitId] = useState(race.circuitId)
  const [error, setError] = useState<string | null>(null)
  const submit = async (): Promise<void> => {
    const date = fromArgentinaLocalInput(when)
    setError(date === null ? INVALID_DATE_MESSAGE : null)
    if (date === null) {
      return
    }
    await onSubmit({ name, date, type, circuitId, version: race.version }).catch((err: unknown) =>
      setError(err instanceof Error ? err.message : 'No se pudo modificar el evento.'),
    )
  }
  return { name, setName, when, setWhen, type, setType, circuitId, setCircuitId, error, submit }
}

export const RaceScheduleForm = ({ race, circuits, onCancel, onSubmit }: Props): ReactNode => {
  const d = useScheduleDraft(race, onSubmit)
  return (
    <form
      noValidate
      className="flex flex-col gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        void d.submit()
      }}
    >
      {d.error && (
        <Alert variant="destructive">
          <AlertDescription>{d.error}</AlertDescription>
        </Alert>
      )}
      <FormField
        id="race-name"
        label="Nombre"
        value={d.name}
        onChange={(e) => d.setName(e.target.value)}
      />
      <FormField
        id="race-when"
        type="datetime-local"
        label="Fecha y hora (Argentina)"
        value={d.when}
        onChange={(e) => d.setWhen(e.target.value)}
      />
      <RaceScheduleFields
        type={d.type}
        circuitId={d.circuitId}
        circuits={circuits}
        onTypeChange={d.setType}
        onCircuitChange={d.setCircuitId}
      />
      <DialogFooter className="mt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit" variant="accent">
          Guardar cambios
        </Button>
      </DialogFooter>
    </form>
  )
}
