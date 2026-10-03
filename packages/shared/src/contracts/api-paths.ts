export const API_PATHS = {
  health: '/health',
  categories: '/categories',
  auth: '/api/auth',
  teams: '/teams',
  teamStaff: '/team-staff',
  races: '/races',
  notifications: '/notifications',
} as const

export const categoryPath = (id: string): string => `${API_PATHS.categories}/${id}`
export const teamStaffPath = (id: string): string => `${API_PATHS.teamStaff}/${id}`
const seasonQuery = (season: number, category: string | null): string =>
  category === null
    ? `season=${season}`
    : `season=${season}&category=${encodeURIComponent(category)}`

export const racesOfSeasonPath = (season: number, category: string | null = null): string =>
  `${API_PATHS.races}?${seasonQuery(season, category)}`
export const raceClassificationPath = (id: string): string =>
  `${API_PATHS.races}/${id}/classification`
export const raceDriversPath = (id: string): string => `${API_PATHS.races}/${id}/drivers`
export const confirmNotificationPath = (id: string): string =>
  `${API_PATHS.notifications}/${id}/confirm`
export const NOTIFICATIONS_AUDIT_PATH = `${API_PATHS.notifications}/audit`
export const seasonStandingsPath = (season: number, category: string | null = null): string =>
  `${API_PATHS.races}/standings?${seasonQuery(season, category)}`
