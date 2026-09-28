import { z } from 'zod'
import { RACE_TYPES } from '../domain/scoring'
import { versionSchema } from './common'

export const MAX_CLASSIFIED_DRIVERS = 30

const entrySchema = z.strictObject({
  driverId: z.uuid('El piloto elegido no es válido.'),
})

const hasUniqueDrivers = (entries: readonly { driverId: string }[]): boolean =>
  new Set(entries.map((entry) => entry.driverId)).size === entries.length

export const raceClassificationBodySchema = z.strictObject({
  version: versionSchema,
  entries: z
    .array(entrySchema)
    .min(1, 'La clasificación debe tener al menos un piloto.')
    .max(MAX_CLASSIFIED_DRIVERS, 'La clasificación no puede tener más de 30 pilotos.')
    .refine(hasUniqueDrivers, 'Un piloto no puede aparecer dos veces en la clasificación.'),
})

export const raceTypeSchema = z.enum(RACE_TYPES)

export const raceSummarySchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  type: raceTypeSchema,
  round: z.int().positive(),
  date: z.iso.datetime(),
  seasonYear: z.int(),
  categoryCode: z.string(),
  circuitName: z.string(),
  version: versionSchema,
  resultsRevision: z.int().nonnegative(),
  winnerName: z.string().nullable(),
})

export const classifiedResultSchema = z.strictObject({
  position: z.int().positive(),
  driverId: z.uuid(),
  driverCode: z.string(),
  driverName: z.string(),
  teamId: z.uuid(),
  teamName: z.string(),
  points: z.int().nonnegative(),
})

export const raceClassificationSchema = z.strictObject({
  race: raceSummarySchema,
  results: z.array(classifiedResultSchema).readonly(),
})

export const eligibleDriverSchema = z.strictObject({
  id: z.uuid(),
  code: z.string(),
  name: z.string(),
  teamName: z.string(),
})

export const eligibleDriverListSchema = z.array(eligibleDriverSchema).readonly()

export const raceSummaryListSchema = z.array(raceSummarySchema).readonly()

export const raceListQuerySchema = z.strictObject({
  season: z.coerce.number().pipe(z.int().min(1950, 'La temporada no es válida.').max(2100)),
})

export type RaceClassificationBody = z.infer<typeof raceClassificationBodySchema>
export type RaceSummary = z.infer<typeof raceSummarySchema>
export type ClassifiedResult = z.infer<typeof classifiedResultSchema>
export type RaceClassification = z.infer<typeof raceClassificationSchema>
export type EligibleDriver = z.infer<typeof eligibleDriverSchema>
export type RaceListQuery = z.infer<typeof raceListQuerySchema>
