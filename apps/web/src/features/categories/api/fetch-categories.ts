import { API_PATHS, type Category, categoryListSchema } from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const CATEGORIES_QUERY_KEY = ['categories'] as const

export const fetchCategories = (): Promise<readonly Category[]> =>
  apiRequest({ path: API_PATHS.categories, schema: categoryListSchema })
