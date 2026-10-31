import type { CreateTeamDriverBody, DriverRole, UpdateTeamDriverBody } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'

export type TeamDriversRepository = {
  readonly listAll: () => Promise<readonly DriverRow[]>
  readonly listByTeam: (teamId: string) => Promise<readonly DriverRow[]>
  readonly findById: (id: string) => Promise<DriverRow | null>
  readonly findByNumber: (teamId: string, number: number) => Promise<DriverRow | null>
  readonly findByCode: (code: string) => Promise<DriverRow | null>
  readonly countByTeamAndRole: (teamId: string, role: DriverRole) => Promise<number>
  readonly create: (teamId: string, body: CreateTeamDriverBody) => Promise<DriverRow>
  readonly update: (id: string, body: UpdateTeamDriverBody) => Promise<DriverRow | null>
}
