import type { CreateTechnicalControlBody, TechnicalControl } from '@fia/shared/contracts'
import type {
  TechnicalControlsListFilter,
  TechnicalControlsRepository,
} from '../features/technical-controls/technical-controls.port'

export type InMemoryTechnicalControlsRepository = TechnicalControlsRepository & {
  readonly controls: TechnicalControl[]
}

export const createInMemoryTechnicalControlsRepository = (
  initial: readonly TechnicalControl[] = [],
  driverTeams: ReadonlyMap<string, string> = new Map(),
): InMemoryTechnicalControlsRepository => {
  const controls: TechnicalControl[] = [...initial]

  return {
    controls,
    list: async (filter: TechnicalControlsListFilter) => {
      let result = controls.filter((c) => new Date(c.expiresAt) > filter.activeAt)
      if (filter.teamId) {
        result = result.filter((c) => c.teamId === filter.teamId)
      }
      if (filter.controlType) {
        result = result.filter((c) => c.controlType === filter.controlType)
      }
      if (filter.status) {
        result = result.filter((c) => c.status === filter.status)
      }
      if (filter.season) {
        result = result.filter((c) => new Date(c.inspectedAt).getUTCFullYear() === filter.season)
      }
      return result
    },
    create: async (body: CreateTechnicalControlBody) => {
      const now = new Date().toISOString()
      const control: TechnicalControl = {
        id: `00000000-0000-4000-8000-${String(controls.length + 1).padStart(12, '0')}`,
        teamId: body.teamId,
        teamName: 'Test Team',
        driverId: body.driverId ?? null,
        driverName: body.driverId ? 'Test Driver' : null,
        carNumber: body.carNumber,
        raceId: body.raceId ?? null,
        raceName: body.raceId ? 'Test Race' : null,
        controlType: body.controlType,
        status: body.status,
        notes: body.notes ?? null,
        inspectedAt: body.inspectedAt,
        expiresAt: body.expiresAt,
        version: 1,
        createdAt: now,
      }
      controls.push(control)
      return control
    },
    driverBelongsToTeam: async (driverId, teamId) =>
      driverTeams.has(driverId) ? driverTeams.get(driverId) === teamId : true,
  }
}
