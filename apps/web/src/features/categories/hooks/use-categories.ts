import type { Category } from '@fia/shared/contracts'
import { type UseQueryResult, useQuery } from '@tanstack/react-query'
import { CATEGORIES_QUERY_KEY, fetchCategories } from '../api/fetch-categories'

export const useCategories = (): UseQueryResult<readonly Category[]> =>
  useQuery({ queryKey: CATEGORIES_QUERY_KEY, queryFn: fetchCategories })
