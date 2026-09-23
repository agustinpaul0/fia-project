import { z } from 'zod'
import { versionSchema } from './common'

export const createCircuitBodySchema = z.strictObject({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(100),
  country: z.string().trim().min(2, 'El país debe tener al menos 2 caracteres.').max(60),
  city: z.string().trim().min(2, 'La ciudad debe tener al menos 2 caracteres.').max(60),
  lengthKm: z.string().regex(/^\d{1,2}\.\d{3}$/, 'La longitud debe tener formato X.XXX km.'),
})

export const circuitSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  country: z.string(),
  city: z.string(),
  lengthKm: z.string(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Circuit = z.infer<typeof circuitSchema>
export type CreateCircuitBody = z.infer<typeof createCircuitBodySchema>
