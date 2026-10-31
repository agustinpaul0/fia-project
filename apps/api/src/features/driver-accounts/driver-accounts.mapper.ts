import type { DriverAccount } from '@fia/shared/contracts'
import type { DriverAccountRow } from '@fia/shared/db'

export type JoinedDriverAccountRow = {
  readonly account: DriverAccountRow
  readonly userName: string
  readonly userEmail: string
  readonly driverFirstName: string
  readonly driverLastName: string
  readonly driverCode: string
  readonly teamName: string | null
}

export const toDriverAccountDto = (row: JoinedDriverAccountRow): DriverAccount => ({
  id: row.account.id,
  userId: row.account.userId,
  driverId: row.account.driverId,
  driverName: `${row.driverFirstName} ${row.driverLastName}`,
  driverCode: row.driverCode,
  teamName: row.teamName,
  name: row.userName,
  email: row.userEmail,
  role: 'driver',
  isOfficial: true,
  isActive: row.account.isActive,
  deactivatedAt: row.account.deactivatedAt ? row.account.deactivatedAt.toISOString() : null,
  version: row.account.version,
  createdAt: row.account.createdAt.toISOString(),
  updatedAt: row.account.updatedAt.toISOString(),
})
