export const API_PATHS = {
  health: '/health',
  categories: '/categories',
  auth: '/api/auth',
  teams: '/teams',
  teamStaff: '/team-staff',
} as const

export const categoryPath = (id: string): string => `${API_PATHS.categories}/${id}`
export const teamStaffPath = (id: string): string => `${API_PATHS.teamStaff}/${id}`
