import { isValidDateRange, type SortOrder } from '@fia/shared/contracts'
import { useState } from 'react'
import { dayEndIso, dayStartIso } from '@/lib/argentina-day'

export type CommonFilterValues = {
  readonly season?: number | undefined
  readonly fromDay?: string | undefined
  readonly toDay?: string | undefined
  readonly sort?: SortOrder | undefined
}

export type CommonFilterQuery = {
  readonly season?: number | undefined
  readonly from?: string | undefined
  readonly to?: string | undefined
  readonly sort?: SortOrder | undefined
}

export type CommonFilters = {
  readonly values: CommonFilterValues
  readonly setValues: (values: CommonFilterValues) => void
  readonly query: CommonFilterQuery
  readonly rangeError: string | null
  readonly isActive: boolean
  readonly reset: () => void
}

export const RANGE_ERROR = 'La fecha de inicio no puede ser posterior a la fecha de fin.'

export const toCommonQuery = (values: CommonFilterValues): CommonFilterQuery => ({
  season: values.season,
  from: values.fromDay ? dayStartIso(values.fromDay) : undefined,
  to: values.toDay ? dayEndIso(values.toDay) : undefined,
  sort: values.sort,
})

export const useCommonFilters = (initial: CommonFilterValues = {}): CommonFilters => {
  const [values, setValues] = useState<CommonFilterValues>(initial)
  const full = toCommonQuery(values)
  const validRange = isValidDateRange(full)
  return {
    values,
    setValues,
    query: validRange ? full : { ...full, from: undefined, to: undefined },
    rangeError: validRange ? null : RANGE_ERROR,
    isActive: Object.values(values).some((v) => v !== undefined && v !== ''),
    reset: () => setValues({}),
  }
}
