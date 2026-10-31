import type { Penalty } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { IdentifierFilters } from '@/components/common/identifier-filters'
import { PenaltiesTable } from './penalties-table'

export const PenaltiesList = ({
  penalties,
  onConfirm,
}: {
  readonly penalties: readonly Penalty[]
  readonly onConfirm?: ((id: string) => void) | undefined
}): ReactNode => (
  <IdentifierFilters items={penalties}>
    {(visible) => <PenaltiesTable penalties={visible} onConfirm={onConfirm} />}
  </IdentifierFilters>
)
