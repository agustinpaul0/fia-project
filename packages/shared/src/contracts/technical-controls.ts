import { z } from 'zod'
import { versionSchema } from './common'

export const technicalControlTypeSchema = z.enum([
  'weight',
  'fuel',
  'dimensions',
  'engine',
  'safety',
  'post_race',
])

export const technicalControlStatusSchema = z.enum(['passed', 'rejected'])

export const createTechnicalControlBodySchema = z.strictObject({
  teamId: z.uuid('Elegí una escudería válida.'),
  driverId: z.uuid('El piloto debe ser un UUID válido.').nullable().optional(),
  carNumber: z.number().int().min(1).max(99).nullable().optional(),
  raceId: z.uuid('La carrera debe ser un UUID válido.').nullable().optional(),
  controlType: technicalControlTypeSchema,
  status: technicalControlStatusSchema,
  notes: z.string().trim().max(500).nullable().optional(),
  inspectedAt: z.iso.datetime().optional(),
  expiresAt: z.iso.datetime().nullable().optional(),
})

export const technicalControlSchema = z.strictObject({
  id: z.uuid(),
  teamId: z.uuid(),
  teamName: z.string(),
  driverId: z.uuid().nullable(),
  driverName: z.string().nullable(),
  carNumber: z.number().int().nullable(),
  raceId: z.uuid().nullable(),
  raceName: z.string().nullable(),
  controlType: technicalControlTypeSchema,
  status: technicalControlStatusSchema,
  notes: z.string().nullable(),
  inspectedAt: z.iso.datetime(),
  expiresAt: z.iso.datetime().nullable(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
})

export const technicalControlListSchema = z.array(technicalControlSchema).readonly()

export const technicalControlsQuerySchema = z.strictObject({
  season: z.coerce.number().int().min(2000).max(2100).optional(),
  teamId: z.uuid().optional(),
  controlType: technicalControlTypeSchema.optional(),
  status: technicalControlStatusSchema.optional(),
})

export type TechnicalControlType = z.infer<typeof technicalControlTypeSchema>
export type TechnicalControlStatus = z.infer<typeof technicalControlStatusSchema>
export type CreateTechnicalControlBody = z.infer<typeof createTechnicalControlBodySchema>
export type CreateTechnicalControlInput = z.input<typeof createTechnicalControlBodySchema>
export type TechnicalControl = z.infer<typeof technicalControlSchema>
export type TechnicalControlList = z.infer<typeof technicalControlListSchema>
export type TechnicalControlsQuery = z.infer<typeof technicalControlsQuerySchema>
