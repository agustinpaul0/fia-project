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
export const racesOfSeasonPath = (season: number): string => `${API_PATHS.races}?season=${season}`
export const raceClassificationPath = (id: string): string =>
  `${API_PATHS.races}/${id}/classification`
export const raceDriversPath = (id: string): string => `${API_PATHS.races}/${id}/drivers`
export const confirmNotificationPath = (id: string): string =>
  `${API_PATHS.notifications}/${id}/confirm`
export const NOTIFICATIONS_AUDIT_PATH = `${API_PATHS.notifications}/audit`
export const seasonStandingsPath = (season: number): string =>
  `${API_PATHS.races}/standings?season=${season}`
