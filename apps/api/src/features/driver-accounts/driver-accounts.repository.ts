import type { DriverAccount } from '@fia/shared/contracts'
import { driverAccounts } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import { firstOrThrow } from '../../core/db/first-or-throw'
import {
  type ConstraintErrorMap,
  translateConstraintViolations,
} from '../../core/errors/constraint-violations'
import type { DriverAccountsRepository } from './driver-accounts.port'
import { findAccountTarget, findDriverAccount, listDriverAccounts } from './driver-accounts.read'

const DRIVER_ACCOUNT_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  driver_accounts_driver_id_unique: 'DRIVER_ACCOUNT_ALREADY_EXISTS',
  driver_accounts_user_id_unique: 'USER_ALREADY_EXISTS',
  driver_accounts_driver_id_drivers_id_fk: 'DRIVER_NOT_FOUND',
}

const sameVersion = (id: string, version: number) =>
  and(eq(driverAccounts.id, id), eq(driverAccounts.version, version))

export const createDrizzleDriverAccountsRepository = (db: DbExecutor): DriverAccountsRepository => {
  const findById = (id: string) => findDriverAccount(db, eq(driverAccounts.id, id))
  const reload = async (rows: readonly { id: string }[]): Promise<DriverAccount | null> =>
    rows[0] ? findById(rows[0].id) : null
  const returningId = { id: driverAccounts.id }
  return {
    list: () => listDriverAccounts(db),
    findById,
    findByDriverId: (driverId) => findDriverAccount(db, eq(driverAccounts.driverId, driverId)),
    findDriver: (driverId) => findAccountTarget(db, driverId),
    create: (input) =>
      translateConstraintViolations(DRIVER_ACCOUNT_CONSTRAINT_ERRORS, async () => {
        const inserted = firstOrThrow(
          await db.insert(driverAccounts).values(input).returning(returningId),
        )
        const created = await findById(inserted.id)
        if (!created) {
          throw new AppError('INTERNAL_ERROR')
        }
        return created
      }),
    bumpVersion: async (id, version) =>
      reload(
        await db
          .update(driverAccounts)
          .set({ version: version + 1, updatedAt: new Date() })
          .where(sameVersion(id, version))
          .returning(returningId),
      ),
    deactivate: async (id, input) =>
      reload(
        await db
          .update(driverAccounts)
          .set({
            isActive: false,
            deactivatedAt: input.deactivatedAt,
            deactivatedBy: input.deactivatedBy,
            version: input.version + 1,
            updatedAt: input.deactivatedAt,
          })
          .where(sameVersion(id, input.version))
          .returning(returningId),
      ),
  }
}
