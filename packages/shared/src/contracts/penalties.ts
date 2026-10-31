import { z } from 'zod'
import { versionSchema } from './common'
import { commonFilterFields, DATE_RANGE_ISSUE, isValidDateRange } from './common-filters'

export const penaltyTypeSchema = z.enum([
  'time_penalty',
  'grid_penalty',
  'points_deduction',
  'disqualification',
  'fine',
  'reprimand',
])

export const createPenaltyBodySchema = z.strictObject({
  teamId: z.uuid('Elegí una escudería válida.'),
  driverId: z.uuid('El piloto debe ser un UUID válido.').nullable().optional(),
  raceId: z.uuid('La carrera debe ser un UUID válido.').nullable().optional(),
  type: penaltyTypeSchema,
  penalty: z.string().trim().min(2, 'La penalización debe tener al menos 2 caracteres.').max(100),
  reason: z.string().trim().min(5, 'El motivo debe tener al menos 5 caracteres.').max(255),
  issuedAt: z.iso.datetime().optional(),
})

export const penaltyNotificationStatusSchema = z.enum(['pending', 'confirmed'])

export const penaltySchema = z.strictObject({
  id: z.uuid(),
  teamId: z.uuid(),
  teamName: z.string(),
  categoryCode: z.string(),
  driverId: z.uuid().nullable(),
  driverName: z.string().nullable(),
  raceId: z.uuid().nullable(),
  raceName: z.string().nullable(),
  type: penaltyTypeSchema,
  penalty: z.string(),
  reason: z.string(),
  issuedAt: z.iso.datetime(),
  confirmedAt: z.iso.datetime().nullable().optional(),
  confirmedByUserId: z.string().nullable().optional(),
  notificationStatus: penaltyNotificationStatusSchema.nullable().optional(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
})

export const penaltyListSchema = z.array(penaltySchema).readonly()

export const penaltiesQuerySchema = z
  .strictObject({
    season: commonFilterFields.season,
    from: commonFilterFields.from,
    to: commonFilterFields.to,
    teamId: commonFilterFields.teamId,
    driverId: commonFilterFields.driverId,
    sort: commonFilterFields.sort,
    type: penaltyTypeSchema.optional(),
  })
  .refine(isValidDateRange, DATE_RANGE_ISSUE)

export type PenaltyType = z.infer<typeof penaltyTypeSchema>
export type CreatePenaltyBody = z.infer<typeof createPenaltyBodySchema>
export type CreatePenaltyInput = z.input<typeof createPenaltyBodySchema>
export type Penalty = z.infer<typeof penaltySchema>
export type PenaltyList = z.infer<typeof penaltyListSchema>
export type PenaltiesQuery = z.infer<typeof penaltiesQuerySchema>
