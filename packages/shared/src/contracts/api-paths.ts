export const API_PATHS = {
  health: '/health',
  categories: '/categories',
} as const

export const categoryPath = (id: string): string => `${API_PATHS.categories}/${id}`
