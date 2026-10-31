export type DateCriteria = {
  readonly season?: number | undefined
  readonly from?: string | undefined
  readonly to?: string | undefined
}

export type DateSort = 'relevance' | 'date_desc' | 'date_asc'

export const matchesDateCriteria = (iso: string, criteria: DateCriteria): boolean => {
  const at = new Date(iso)
  return (
    (criteria.season === undefined || at.getUTCFullYear() === criteria.season) &&
    (criteria.from === undefined || at >= new Date(criteria.from)) &&
    (criteria.to === undefined || at <= new Date(criteria.to))
  )
}

export const compareIsoDates =
  (sort: DateSort | undefined) =>
  (a: string, b: string): number =>
    sort === 'date_asc' ? a.localeCompare(b) : b.localeCompare(a)
