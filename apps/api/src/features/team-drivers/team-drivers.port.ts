import type { CreateTeamDriverBody, DriverRole, UpdateTeamDriverBody } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'

export type DriverWithTeam = DriverRow & {
  readonly teamName: string | null
  readonly hasOfficialAccount: boolean
}

export type TeamDriversRepository = {
  readonly listAll: () => Promise<readonly DriverWithTeam[]>
  readonly listByTeam: (teamId: string) => Promise<readonly DriverRow[]>
  readonly findById: (id: string) => Promise<DriverRow | null>
  readonly findByNumber: (teamId: string, number: number) => Promise<DriverRow | null>
  readonly findByCode: (code: string) => Promise<DriverRow | null>
  readonly countByTeamAndRole: (teamId: string, role: DriverRole) => Promise<number>
  readonly create: (teamId: string, body: CreateTeamDriverBody) => Promise<DriverRow>
  readonly update: (
    id: string,
    body: UpdateTeamDriverBody,
    updatedBy: string,
  ) => Promise<DriverRow | null>
}
