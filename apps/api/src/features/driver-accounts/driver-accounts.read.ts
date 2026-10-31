import type { DriverAccount } from '@fia/shared/contracts'
import { driverAccounts, drivers, teams, user } from '@fia/shared/db'
import { asc, eq, type SQL } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { toDriverAccountDto } from './driver-accounts.mapper'
import type { DriverAccountTarget } from './driver-accounts.port'

const selectJoined = (db: DbExecutor, where?: SQL) =>
  db
    .select({
      account: driverAccounts,
      userName: user.name,
      userEmail: user.email,
      driverFirstName: drivers.firstName,
      driverLastName: drivers.lastName,
      driverCode: drivers.code,
      teamName: teams.name,
    })
    .from(driverAccounts)
    .innerJoin(user, eq(driverAccounts.userId, user.id))
    .innerJoin(drivers, eq(driverAccounts.driverId, drivers.id))
    .leftJoin(teams, eq(drivers.teamId, teams.id))
    .where(where)

export const findDriverAccount = async (
  db: DbExecutor,
  where: SQL,
): Promise<DriverAccount | null> => {
  const [row] = await selectJoined(db, where).limit(1)
  return row ? toDriverAccountDto(row) : null
}

export const listDriverAccounts = async (db: DbExecutor): Promise<readonly DriverAccount[]> =>
  (await selectJoined(db).orderBy(asc(drivers.lastName), asc(drivers.firstName))).map(
    toDriverAccountDto,
  )

export const findAccountTarget = async (
  db: DbExecutor,
  driverId: string,
): Promise<DriverAccountTarget | null> => {
  const [row] = await db
    .select({ id: drivers.id, teamId: drivers.teamId })
    .from(drivers)
    .where(eq(drivers.id, driverId))
    .limit(1)
  return row ?? null
}
