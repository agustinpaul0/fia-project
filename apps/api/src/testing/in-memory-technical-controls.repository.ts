import type { CreateTechnicalControlBody, TechnicalControl } from '@fia/shared/contracts'
import { compareIsoDates, matchesDateCriteria } from '@fia/shared/domain'
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
    list: async (filter: TechnicalControlsListFilter) =>
      [...controls]
        .sort((a, b) => compareIsoDates(filter.sort)(a.inspectedAt, b.inspectedAt))
        .filter(
          (c) =>
            new Date(c.expiresAt) > filter.activeAt &&
            matchesDateCriteria(c.inspectedAt, filter) &&
            (!filter.teamId || c.teamId === filter.teamId) &&
            (!filter.driverId || c.driverId === filter.driverId) &&
            (!filter.controlType || c.controlType === filter.controlType) &&
            (!filter.status || c.status === filter.status),
        ),
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
