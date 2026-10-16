import {
  type TechnicalControl,
  technicalControlStatusSchema,
  technicalControlTypeSchema,
} from '@fia/shared/contracts'

type RawTechnicalControlRow = {
  readonly id: string
  readonly teamId: string
  readonly teamName: string
  readonly driverId: string | null
  readonly driverFirstName: string | null
  readonly driverLastName: string | null
  readonly carNumber: number
  readonly raceId: string | null
  readonly raceName: string | null
  readonly controlType: string
  readonly status: string
  readonly notes: string | null
  readonly inspectedAt: Date
  readonly expiresAt: Date
  readonly version: number
  readonly createdAt: Date
}

export const toTechnicalControlDto = (row: RawTechnicalControlRow): TechnicalControl => ({
  id: row.id,
  teamId: row.teamId,
  teamName: row.teamName,
  driverId: row.driverId,
  driverName: row.driverFirstName ? `${row.driverFirstName} ${row.driverLastName}` : null,
  carNumber: row.carNumber,
  raceId: row.raceId,
  raceName: row.raceName ?? null,
  controlType: technicalControlTypeSchema.parse(row.controlType),
  status: technicalControlStatusSchema.parse(row.status),
  notes: row.notes,
  inspectedAt: row.inspectedAt.toISOString(),
  expiresAt: row.expiresAt.toISOString(),
  version: row.version,
  createdAt: row.createdAt.toISOString(),
})
