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

export const driverLicenseSchema = z
  .string()
  .trim()
  .min(3, 'La licencia deportiva debe tener al menos 3 caracteres.')
  .max(20, 'La licencia deportiva no puede superar los 20 caracteres.')
  .regex(/^[A-Za-z0-9-]+$/, 'La licencia sólo puede tener letras, números y guiones.')

export const createDriverBodySchema = z.strictObject({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(60),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.').max(60),
  code: driverCodeSchema,
  number: driverNumberSchema,
  country: z.string().trim().min(2, 'El país debe tener al menos 2 caracteres.').max(60),
  teamId: z.uuid('El identificador de equipo debe ser un UUID válido.').nullable().optional(),
  role: driverRoleSchema.default('main'),
})

export const createTeamDriverBodySchema = z.strictObject({
  firstName: z.string().trim().min(2, 'El nombre debe tener al menos 2 caracteres.').max(60),
  lastName: z.string().trim().min(2, 'El apellido debe tener al menos 2 caracteres.').max(60),
  code: driverCodeSchema,
  number: driverNumberSchema,
  country: z.string().trim().min(2, 'El país debe tener al menos 2 caracteres.').max(60),
  license: driverLicenseSchema,
  role: driverRoleSchema.default('main'),
})

export const driverSchema = z.strictObject({
  id: z.uuid(),
  firstName: z.string(),
  lastName: z.string(),
  code: driverCodeSchema,
  number: driverNumberSchema,
  country: z.string(),
  license: z.string().nullable(),
  teamId: z.uuid().nullable(),
  role: driverRoleSchema,
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const driverListSchema = z.array(driverSchema).readonly()

export type DriverRole = z.infer<typeof driverRoleSchema>
export type Driver = z.infer<typeof driverSchema>
export type CreateDriverBody = z.infer<typeof createDriverBodySchema>
export type CreateTeamDriverBody = z.infer<typeof createTeamDriverBodySchema>
export type CreateTeamDriverInput = z.input<typeof createTeamDriverBodySchema>
export type DriverList = z.infer<typeof driverListSchema>
