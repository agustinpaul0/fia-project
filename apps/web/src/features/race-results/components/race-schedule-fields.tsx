import type { CircuitOption } from '@fia/shared/contracts'
import type { RaceType } from '@fia/shared/domain'
import type { ReactNode } from 'react'
import { FIELD_CLASS, LABEL_CLASS } from '@/features/team-staff/components/field-message'

type Props = {
  readonly type: RaceType
  readonly circuitId: string
  readonly circuits: readonly CircuitOption[]
  readonly onTypeChange: (type: RaceType) => void
  readonly onCircuitChange: (circuitId: string) => void
}

export const RaceScheduleFields = (p: Props): ReactNode => (
  <>
    <label htmlFor="race-type" className={LABEL_CLASS}>
      Tipo
    </label>
    <select
      id="race-type"
      className={FIELD_CLASS}
      value={p.type}
      onChange={(e) => p.onTypeChange(e.target.value === 'sprint' ? 'sprint' : 'grand_prix')}
    >
      <option value="grand_prix">Gran Premio</option>
      <option value="sprint">Sprint</option>
    </select>
    <label htmlFor="race-circuit" className={LABEL_CLASS}>
      Circuito
    </label>
    <select
      id="race-circuit"
      className={FIELD_CLASS}
      value={p.circuitId}
      onChange={(e) => p.onCircuitChange(e.target.value)}
    >
      {p.circuits.map((c) => (
        <option key={c.id} value={c.id}>{`${c.name} (${c.country})`}</option>
      ))}
    </select>
  </>
)
