import { z } from 'zod'
import { versionSchema } from './common'

export const racePositionSchema = z
  .number()
  .int('La posición debe ser un número entero.')
  .min(1, 'La posición debe ser mayor o igual a 1.')

export const racePointsSchema = z
  .number()
  .int('Los puntos deben ser un número entero.')
  .min(0, 'Los puntos deben ser mayores o iguales a 0.')

export const createRaceResultBodySchema = z.strictObject({
  raceId: z.uuid('El identificador de carrera debe ser un UUID válido.'),
  driverId: z.uuid('El identificador de piloto debe ser un UUID válido.'),
  teamId: z.uuid('El identificador de equipo debe ser un UUID válido.'),
  position: racePositionSchema,
  points: racePointsSchema.default(0),
})

export const raceResultSchema = z.strictObject({
  id: z.uuid(),
  raceId: z.uuid(),
  driverId: z.uuid(),
  teamId: z.uuid(),
  position: racePositionSchema,
  points: racePointsSchema,
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type RaceResult = z.infer<typeof raceResultSchema>
export type CreateRaceResultBody = z.infer<typeof createRaceResultBodySchema>
