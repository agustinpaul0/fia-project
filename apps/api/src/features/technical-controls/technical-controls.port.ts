import type {
  CreateTechnicalControlBody,
  TechnicalControl,
  TechnicalControlsQuery,
} from '@fia/shared/contracts'

export type TechnicalControlsListFilter = TechnicalControlsQuery & { readonly activeAt: Date }

export type TechnicalControlsRepository = {
  readonly list: (filter: TechnicalControlsListFilter) => Promise<readonly TechnicalControl[]>
  readonly create: (body: CreateTechnicalControlBody) => Promise<TechnicalControl>
  readonly driverBelongsToTeam: (driverId: string, teamId: string) => Promise<boolean>
}
