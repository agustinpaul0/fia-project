export const API_PATHS = {
  health: '/health',
  categories: '/categories',
  auth: '/api/auth',
} as const

export const categoryPath = (id: string): string => `${API_PATHS.categories}/${id}`
