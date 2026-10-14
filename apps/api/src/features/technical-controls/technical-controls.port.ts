import type {
  CreateTechnicalControlBody,
  TechnicalControl,
  TechnicalControlsQuery,
} from '@fia/shared/contracts'

export type TechnicalControlsRepository = {
  readonly list: (filter: TechnicalControlsQuery) => Promise<readonly TechnicalControl[]>
  readonly create: (body: CreateTechnicalControlBody) => Promise<TechnicalControl>
  readonly driverBelongsToTeam: (driverId: string, teamId: string) => Promise<boolean>
}
