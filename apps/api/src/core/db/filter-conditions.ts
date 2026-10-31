import type { SortOrder } from '@fia/shared/contracts'
import { asc, desc, eq, gte, lte, type SQL } from 'drizzle-orm'
import type { PgColumn } from 'drizzle-orm/pg-core'

export type DateFilter = {
  readonly season?: number | undefined
  readonly from?: string | undefined
  readonly to?: string | undefined
}

export const seasonBounds = (season: number): { readonly start: Date; readonly end: Date } => ({
  start: new Date(Date.UTC(season, 0, 1)),
  end: new Date(Date.UTC(season, 11, 31, 23, 59, 59, 999)),
})

export const dateConditions = (column: PgColumn, filter: DateFilter): SQL[] => {
  const conditions: SQL[] = []
  if (filter.season !== undefined) {
    const { start, end } = seasonBounds(filter.season)
    conditions.push(gte(column, start), lte(column, end))
  }
  if (filter.from !== undefined) {
    conditions.push(gte(column, new Date(filter.from)))
  }
  if (filter.to !== undefined) {
    conditions.push(lte(column, new Date(filter.to)))
  }
  return conditions
}

export const optionalEq = (column: PgColumn, value: string | undefined): SQL[] =>
  value === undefined ? [] : [eq(column, value)]

export const dateOrder = (column: PgColumn, sort: SortOrder | undefined): SQL =>
  sort === 'date_asc' ? asc(column) : desc(column)
