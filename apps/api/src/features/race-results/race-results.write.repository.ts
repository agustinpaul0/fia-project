import type { UpdateRaceBody } from '@fia/shared/contracts'
import { raceResults, races } from '@fia/shared/db'
import { and, eq } from 'drizzle-orm'
import type { TransactionalDatabase } from '../../core/db/client'
import {
  type ConstraintErrorMap,
  translateConstraintViolations,
} from '../../core/errors/constraint-violations'
import type { ReplaceClassificationInput } from './race-results.port'

const RESULT_CONSTRAINT_ERRORS: ConstraintErrorMap = {
  race_results_race_driver_unique: 'VALIDATION_FAILED',
  race_results_race_position_unique: 'VALIDATION_FAILED',
  race_results_points_max: 'VALIDATION_FAILED',
  race_results_driver_id_drivers_id_fk: 'DRIVER_NOT_FOUND',
}

const runReplaceClassification = (
  db: TransactionalDatabase,
  input: ReplaceClassificationInput,
): Promise<boolean> =>
  translateConstraintViolations(RESULT_CONSTRAINT_ERRORS, () =>
    db.transaction(async (tx) => {
      const bumped = await tx
        .update(races)
        .set({ version: input.expectedVersion + 1, resultsRevision: input.nextRevision })
        .where(and(eq(races.id, input.raceId), eq(races.version, input.expectedVersion)))
        .returning({ id: races.id })
      if (bumped.length === 0) {
        return false
      }
      await tx.delete(raceResults).where(eq(raceResults.raceId, input.raceId))
      await tx
        .insert(raceResults)
        .values(input.entries.map((entry) => ({ ...entry, raceId: input.raceId })))
      return true
    }),
  )

export const createRaceResultsWriter = (db: TransactionalDatabase) => ({
  replaceClassification: (input: ReplaceClassificationInput): Promise<boolean> =>
    runReplaceClassification(db, input),
  updateRace: async (id: string, body: UpdateRaceBody, userId: string): Promise<boolean> => {
    const updated = await db
      .update(races)
      .set({
        name: body.name,
        date: new Date(body.date),
        type: body.type,
        circuitId: body.circuitId,
        status: 'modified',
        updatedByUserId: userId,
        version: body.version + 1,
        updatedAt: new Date(),
      })
      .where(and(eq(races.id, id), eq(races.version, body.version)))
      .returning({ id: races.id })
    return updated.length > 0
  },
  cancelRace: async (id: string, version: number, userId: string): Promise<boolean> => {
    const cancelled = await db
      .update(races)
      .set({
        status: 'cancelled',
        updatedByUserId: userId,
        version: version + 1,
        updatedAt: new Date(),
      })
      .where(and(eq(races.id, id), eq(races.version, version)))
      .returning({ id: races.id })
    return cancelled.length > 0
  },
})
