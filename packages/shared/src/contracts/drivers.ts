import { z } from 'zod'
import { versionSchema } from './common'

export const driverCodeSchema = z
  .string()
  .trim()
  .regex(/^[A-Z]{3}$/, 'El código debe contener exactamente 3 letras mayúsculas.')

export const driverNumberSchema = z
  .number()
  .int('El número debe ser un entero.')
  .min(1, 'El número de piloto debe estar entre 1 y 99.')
  .max(99, 'El número de piloto debe estar entre 1 y 99.')

export const driverRoleSchema = z.enum(['main', 'reserve'])

export const createDriverBodySchema = z.strictObject({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(60),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.').max(60),
  code: driverCodeSchema,
  number: driverNumberSchema,
  country: z.string().trim().min(2, 'El país debe tener al menos 2 caracteres.').max(60),
  teamId: z.uuid('El identificador de equipo debe ser un UUID válido.').nullable().optional(),
  role: driverRoleSchema.default('main'),
})

export const driverSchema = z.strictObject({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  code: driverCodeSchema,
  number: driverNumberSchema,
  country: z.string(),
  teamId: z.uuid().nullable(),
  role: driverRoleSchema,
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export type DriverRole = z.infer<typeof driverRoleSchema>
export type Driver = z.infer<typeof driverSchema>
export type CreateDriverBody = z.infer<typeof createDriverBodySchema>
