import { z } from 'zod'
import { versionSchema } from './common'
import { commonFilterFields, DATE_RANGE_ISSUE, isValidDateRange } from './common-filters'

export const technicalControlTypeSchema = z.enum([
  'weight',
  'fuel',
  'dimensions',
  'engine',
  'safety',
  'post_race',
])

export const technicalControlStatusSchema = z.enum(['passed', 'rejected'])

const CAR_NUMBER_RANGE = 'El número de auto debe estar entre 1 y 99.'

export const createTechnicalControlBodySchema = z
  .strictObject({
    teamId: z.uuid('Elegí una escudería válida.'),
    driverId: z.uuid('El piloto debe ser un UUID válido.').nullable().optional(),
    carNumber: z
      .number('Ingresá el número de auto inspeccionado.')
      .int(CAR_NUMBER_RANGE)
      .min(1, CAR_NUMBER_RANGE)
      .max(99, CAR_NUMBER_RANGE),
    raceId: z.uuid('La carrera debe ser un UUID válido.').nullable().optional(),
    controlType: technicalControlTypeSchema,
    status: technicalControlStatusSchema,
    notes: z.string().trim().max(500).nullable().optional(),
    inspectedAt: z.iso.datetime('Ingresá la fecha y hora del control.'),
    expiresAt: z.iso.datetime('Ingresá la fecha y hora de expiración.'),
  })
  .refine((body) => new Date(body.expiresAt) > new Date(body.inspectedAt), {
    path: ['expiresAt'],
    message: 'La expiración debe ser posterior al control.',
  })

export const technicalControlSchema = z.strictObject({
  id: z.uuid(),
  teamId: z.uuid(),
  teamName: z.string(),
  driverId: z.uuid().nullable(),
  driverName: z.string().nullable(),
  carNumber: z.number().int(),
  raceId: z.uuid().nullable(),
  raceName: z.string().nullable(),
  controlType: technicalControlTypeSchema,
  status: technicalControlStatusSchema,
  notes: z.string().nullable(),
  inspectedAt: z.iso.datetime(),
  expiresAt: z.iso.datetime(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
})

export const technicalControlListSchema = z.array(technicalControlSchema).readonly()

export const technicalControlsQuerySchema = z
  .strictObject({
    season: commonFilterFields.season,
    from: commonFilterFields.from,
    to: commonFilterFields.to,
    teamId: commonFilterFields.teamId,
    driverId: commonFilterFields.driverId,
    sort: commonFilterFields.sort,
    controlType: technicalControlTypeSchema.optional(),
    status: technicalControlStatusSchema.optional(),
  })
  .refine(isValidDateRange, DATE_RANGE_ISSUE)

export type TechnicalControlType = z.infer<typeof technicalControlTypeSchema>
export type TechnicalControlStatus = z.infer<typeof technicalControlStatusSchema>
export type CreateTechnicalControlBody = z.infer<typeof createTechnicalControlBodySchema>
export type CreateTechnicalControlInput = z.input<typeof createTechnicalControlBodySchema>
export type TechnicalControl = z.infer<typeof technicalControlSchema>
export type TechnicalControlList = z.infer<typeof technicalControlListSchema>
export type TechnicalControlsQuery = z.infer<typeof technicalControlsQuerySchema>
