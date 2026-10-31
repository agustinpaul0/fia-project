import type {
  CreateTechnicalControlBody,
  TechnicalControl,
  TechnicalControlsQuery,
} from '@fia/shared/contracts'
import { AppError, type Role } from '@fia/shared/domain'
import type { TechnicalControlsRepository } from './technical-controls.port'

export type TechnicalControlsViewer = {
  readonly role: Role
  readonly teamId: string | null
} | null

export type TechnicalControlsService = {
  readonly list: (
    filter: TechnicalControlsQuery,
    viewer?: TechnicalControlsViewer,
  ) => Promise<readonly TechnicalControl[]>
  readonly listByTeam: (
    teamId: string | null,
    filter: TechnicalControlsQuery,
  ) => Promise<readonly TechnicalControl[]>
  readonly create: (body: CreateTechnicalControlBody) => Promise<TechnicalControl>
}

const canViewNotes = (control: TechnicalControl, viewer?: TechnicalControlsViewer): boolean => {
  if (viewer === undefined) {
    return true
  }
  if (viewer === null) {
    return false
  }
  if (viewer.role === 'fia_admin') {
    return true
  }
  return viewer.role === 'team_staff' && viewer.teamId === control.teamId
}

export const createTechnicalControlsService = (
  repo: TechnicalControlsRepository,
  now: () => Date = () => new Date(),
): TechnicalControlsService => ({
  list: async (filter, viewer) => {
    const items = await repo.list({ ...filter, activeAt: now() })
    return items.map((c) => (canViewNotes(c, viewer) ? c : { ...c, notes: null }))
  },
  listByTeam: async (teamId, filter) => {
    if (!teamId) {
      throw new AppError('TEAM_REQUIRED')
    }
    return repo.list({ ...filter, teamId, activeAt: now() })
  },
  create: async (body) => {
    if (body.driverId !== null && body.driverId !== undefined) {
      const belongs = await repo.driverBelongsToTeam(body.driverId, body.teamId)
      if (!belongs) {
        throw new AppError('INVALID_TECHNICAL_CONTROL_TARGET')
      }
    }
    return repo.create(body)
  },
})
