import type { DatabaseConnection } from '../../core/db/client'
import type { DbExecutor } from '../../core/db/executor'

class RollbackSignal extends Error {}

export const withRollback = async (
  connection: DatabaseConnection,
  scenario: (tx: DbExecutor) => Promise<void>,
): Promise<void> => {
  try {
    await connection.db.transaction(async (tx) => {
      await scenario(tx)
      throw new RollbackSignal()
    })
  } catch (error) {
    if (!(error instanceof RollbackSignal)) {
      throw error
    }
  }
}
