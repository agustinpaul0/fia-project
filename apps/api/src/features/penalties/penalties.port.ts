import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'

export type PenaltiesRepository = {
  readonly list: (filter: PenaltiesQuery) => Promise<readonly Penalty[]>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
  readonly driverBelongsToTeam: (driverId: string, teamId: string) => Promise<boolean>
}
