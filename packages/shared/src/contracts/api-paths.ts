export const API_PATHS = {
  health: '/health',
  categories: '/categories',
  auth: '/api/auth',
  teams: '/teams',
  teamStaff: '/team-staff',
  races: '/races',
  notifications: '/notifications',
  teamDrivers: '/team-drivers',
  penalties: '/penalties',
  technicalControls: '/technical-controls',
  chat: '/chat',
} as const

export const categoryPath = (id: string): string => `${API_PATHS.categories}/${id}`
export const teamStaffPath = (id: string): string => `${API_PATHS.teamStaff}/${id}`
export const teamDriverPath = (id: string): string => `${API_PATHS.teamDrivers}/${id}`
export const PUBLIC_DRIVERS_PATH = `${API_PATHS.teamDrivers}/public`
export const MY_TECHNICAL_CONTROLS_PATH = `${API_PATHS.technicalControls}/mine`
export const teamDriverOptionsPath = (teamId: string): string =>
  `${API_PATHS.teams}/${teamId}/drivers`
export const teamRaceOptionsPath = (teamId: string, season: number): string =>
  `${API_PATHS.teams}/${teamId}/races?season=${season}`
const seasonQuery = (season: number, category: string | null): string =>
  category === null
    ? `season=${season}`
    : `season=${season}&category=${encodeURIComponent(category)}`

export const racesOfSeasonPath = (season: number, category: string | null = null): string =>
  `${API_PATHS.races}?${seasonQuery(season, category)}`
export const racePath = (id: string): string => `${API_PATHS.races}/${id}`
export const raceClassificationPath = (id: string): string =>
  `${API_PATHS.races}/${id}/classification`
export const raceDriversPath = (id: string): string => `${API_PATHS.races}/${id}/drivers`
export const confirmNotificationPath = (id: string): string =>
  `${API_PATHS.notifications}/${id}/confirm`
export const confirmPenaltyPath = (id: string): string => `${API_PATHS.penalties}/${id}/confirm`
export const NOTIFICATIONS_AUDIT_PATH = `${API_PATHS.notifications}/audit`
export const seasonStandingsPath = (season: number, category: string | null = null): string =>
  `${API_PATHS.races}/standings?${seasonQuery(season, category)}`
