import type { RaceType } from '@fia/shared/domain'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'

export const RACE_TYPE_LABELS: Readonly<Record<RaceType, string>> = {
  grand_prix: 'Gran Premio',
  sprint: 'Sprint',
}

export const RaceTypeBadge = ({ type }: { readonly type: RaceType }): ReactNode => (
  <Badge variant={type === 'sprint' ? 'secondary' : 'outline'}>{RACE_TYPE_LABELS[type]}</Badge>
)
