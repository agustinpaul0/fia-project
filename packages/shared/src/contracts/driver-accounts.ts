import { z } from 'zod'
import { emailSchema, passwordSchema } from './auth'
import { versionSchema } from './common'

const accountNameSchema = z
  .string()
  .trim()
  .min(2, 'El nombre debe tener al menos 2 caracteres.')
  .max(120, 'El nombre no puede superar los 120 caracteres.')

export const createDriverAccountBodySchema = z.strictObject({
  driverId: z.uuid('Elegí un piloto válido.'),
  email: emailSchema,
  password: passwordSchema,
  name: accountNameSchema,
})

export const updateDriverAccountBodySchema = z.strictObject({
  name: accountNameSchema,
  version: versionSchema,
})

export const driverAccountSchema = z.strictObject({
  id: z.string(),
  driverId: z.uuid(),
  name: z.string(),
  email: z.string(),
  role: z.literal('driver'),
  isOfficial: z.literal(true),
  isActive: z.boolean(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const driverAccountListSchema = z.array(driverAccountSchema).readonly()

export type CreateDriverAccountBody = z.infer<typeof createDriverAccountBodySchema>
export type UpdateDriverAccountBody = z.infer<typeof updateDriverAccountBodySchema>
export type DriverAccount = z.infer<typeof driverAccountSchema>
export type DriverAccountList = z.infer<typeof driverAccountListSchema>
