import { z } from 'zod'
import { versionSchema } from './common'

export const createTeamBodySchema = z.strictObject({
  name: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(80),
  country: z.string().trim().min(2, 'El país debe tener al menos 2 caracteres.').max(60),
  categoryId: z.uuid('El identificador de categoría debe ser un UUID válido.'),
})

export const teamOptionSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
})

export const teamOptionListSchema = z.array(teamOptionSchema).readonly()

export const teamSchema = z.strictObject({
  id: z.uuid(),
  name: z.string(),
  country: z.string(),
  categoryId: z.uuid(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type Team = z.infer<typeof teamSchema>
export type CreateTeamBody = z.infer<typeof createTeamBodySchema>
export type TeamOption = z.infer<typeof teamOptionSchema>
