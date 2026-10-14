import type { Driver, DriverRole } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'

export const toDriverDto = (row: DriverRow): Driver => ({
  id: row.id,
  firstName: row.firstName,
  lastName: row.lastName,
  code: row.code,
  number: row.number,
  country: row.country,
  teamId: row.teamId,
  role: row.role as DriverRole,
  version: row.version,
  createdAt: row.createdAt.toISOString(),
  updatedAt: row.updatedAt.toISOString(),
})
