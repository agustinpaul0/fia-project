import type { DatabaseConnection, DatabaseTransaction } from '../../core/db/client'

class RollbackSignal extends Error {}

export const withRollback = async (
  connection: DatabaseConnection,
  scenario: (tx: DatabaseTransaction) => Promise<void>,
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
