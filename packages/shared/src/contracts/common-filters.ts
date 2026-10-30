import { z } from 'zod'

export const sortOrderSchema = z.enum(['relevance', 'date_desc', 'date_asc'])

export const commonFiltersQuerySchema = z
  .strictObject({
    season: z.coerce.number().int().min(2000).max(2100).optional(),
    from: z.iso.datetime('La fecha inicial debe ser un ISO 8601 válido.').optional(),
    to: z.iso.datetime('La fecha final debe ser un ISO 8601 válido.').optional(),
    teamId: z.uuid('El identificador de escudería no es válido.').optional(),
    driverId: z.uuid('El identificador de piloto no es válido.').optional(),
    controlType: z.string().trim().min(1).max(60).optional(),
    sort: sortOrderSchema.optional(),
  })
  .refine((q) => !q.from || !q.to || new Date(q.from) <= new Date(q.to), {
    path: ['to'],
    message: 'La fecha de inicio no puede ser posterior a la fecha de fin.',
  })

export type SortOrder = z.infer<typeof sortOrderSchema>
export type CommonFiltersQuery = z.infer<typeof commonFiltersQuerySchema>
