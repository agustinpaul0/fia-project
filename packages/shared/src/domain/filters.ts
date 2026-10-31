export type FilterableItem = {
  readonly date?: string | undefined
  readonly season?: number | undefined
  readonly teamId?: string | null | undefined
  readonly driverId?: string | null | undefined
  readonly controlType?: string | undefined
}

export type FilterCriteria = {
  readonly season?: number | undefined
  readonly from?: string | undefined
  readonly to?: string | undefined
  readonly teamId?: string | undefined
  readonly driverId?: string | undefined
  readonly controlType?: string | undefined
  readonly sort?: 'relevance' | 'date_desc' | 'date_asc' | undefined
}

const matchesItem = (item: FilterableItem, criteria: FilterCriteria): boolean => {
  const itemDate = item.date ? new Date(item.date) : null
  const itemSeason = item.season ?? (itemDate ? itemDate.getUTCFullYear() : undefined)
  if (criteria.season !== undefined && itemSeason !== criteria.season) {
    return false
  }
  if (criteria.from && itemDate && itemDate < new Date(criteria.from)) {
    return false
  }
  if (criteria.to && itemDate && itemDate > new Date(criteria.to)) {
    return false
  }
  if (criteria.teamId && item.teamId !== criteria.teamId) {
    return false
  }
  if (criteria.driverId && item.driverId !== criteria.driverId) {
    return false
  }
  if (criteria.controlType && item.controlType !== criteria.controlType) {
    return false
  }
  return true
}

const relevanceScore = (dateStr: string | undefined, refMs: number): number => {
  if (!dateStr) {
    return Number.MAX_SAFE_INTEGER
  }
  return Math.abs(new Date(dateStr).getTime() - refMs)
}

export const applyClientFilters = <T extends FilterableItem>(
  items: readonly T[],
  criteria: FilterCriteria,
  referenceDate: Date = new Date(),
): readonly T[] => {
  const filtered = items.filter((item) => matchesItem(item, criteria))
  const sort = criteria.sort ?? 'date_desc'
  const refMs = referenceDate.getTime()
  return [...filtered].sort((a, b) => {
    const aMs = a.date ? new Date(a.date).getTime() : 0
    const bMs = b.date ? new Date(b.date).getTime() : 0
    if (sort === 'date_asc') {
      return aMs - bMs
    }
    if (sort === 'relevance') {
      return relevanceScore(a.date, refMs) - relevanceScore(b.date, refMs)
    }
    return bMs - aMs
  })
}
