import type { CreatePenaltyBody, PenaltiesQuery, Penalty } from '@fia/shared/contracts'

export type PenaltiesListFilter = PenaltiesQuery & { readonly issuedSince: Date }

export type ConfirmPenaltyInput = {
  readonly id: string
  readonly userId: string
  readonly confirmedAt: Date
}

export type PenaltiesRepository = {
  readonly list: (filter: PenaltiesListFilter) => Promise<readonly Penalty[]>
  readonly findById?: (id: string) => Promise<Penalty | null>
  readonly create: (body: CreatePenaltyBody) => Promise<Penalty>
  readonly confirm?: (input: ConfirmPenaltyInput) => Promise<Penalty | null>
  readonly driverBelongsToTeam: (driverId: string, teamId: string) => Promise<boolean>
}
