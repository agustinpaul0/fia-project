import { type Penalty, penaltyTypeSchema } from '@fia/shared/contracts'

type RawPenaltyRow = {
  readonly id: string
  readonly teamId: string
  readonly teamName: string
  readonly categoryCode: string
  readonly driverId: string | null
  readonly driverFirstName: string | null
  readonly driverLastName: string | null
  readonly raceId: string | null
  readonly raceName: string | null
  readonly type: string
  readonly penalty: string
  readonly reason: string
  readonly issuedAt: Date
  readonly confirmedAt?: Date | null | undefined
  readonly confirmedByUserId?: string | null | undefined
  readonly version: number
  readonly createdAt: Date
}

export const toPenaltyDto = (row: RawPenaltyRow): Penalty => ({
  id: row.id,
  teamId: row.teamId,
  teamName: row.teamName,
  categoryCode: row.categoryCode,
  driverId: row.driverId,
  driverName: row.driverFirstName ? `${row.driverFirstName} ${row.driverLastName}` : null,
  raceId: row.raceId,
  raceName: row.raceName ?? null,
  type: penaltyTypeSchema.parse(row.type),
  penalty: row.penalty,
  reason: row.reason,
  issuedAt: row.issuedAt.toISOString(),
  confirmedAt: row.confirmedAt ? row.confirmedAt.toISOString() : null,
  confirmedByUserId: row.confirmedByUserId ?? null,
  notificationStatus: row.confirmedAt ? 'confirmed' : 'pending',
  version: row.version,
  createdAt: row.createdAt.toISOString(),
})
