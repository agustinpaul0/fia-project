import { z } from 'zod'
import { emailSchema, passwordSchema } from './auth'
import { versionSchema } from './common'

export const PHONE_NUMBER_PATTERN = /^[0-9+() -]{7,30}$/
export const FILE_NUMBER_PATTERN = /^[A-Z0-9-]{1,20}$/

export const staffFirstNameSchema = z
  .string()
  .trim()
  .min(1, 'El nombre es obligatorio.')
  .max(60, 'El nombre no puede superar los 60 caracteres.')

export const staffLastNameSchema = z
  .string()
  .trim()
  .min(1, 'El apellido es obligatorio.')
  .max(60, 'El apellido no puede superar los 60 caracteres.')

export const staffRoleInTeamSchema = z
  .string()
  .trim()
  .min(2, 'El cargo debe tener al menos 2 caracteres.')
  .max(60, 'El cargo no puede superar los 60 caracteres.')

export const staffPhoneNumberSchema = z
  .string()
  .trim()
  .regex(PHONE_NUMBER_PATTERN, 'El teléfono debe tener entre 7 y 30 caracteres válidos.')

export const staffFileNumberSchema = z
  .string()
  .trim()
  .toUpperCase()
  .regex(
    FILE_NUMBER_PATTERN,
    'El legajo debe contener entre 1 y 20 caracteres alfanuméricos o guiones.',
  )

export const staffTeamIdSchema = z.uuid('Elegí una escudería.')

export const createTeamStaffBodySchema = z.strictObject({
  firstName: staffFirstNameSchema,
  lastName: staffLastNameSchema,
  email: emailSchema,
  password: passwordSchema,
  teamId: staffTeamIdSchema,
  roleInTeam: staffRoleInTeamSchema,
  phoneNumber: staffPhoneNumberSchema,
  fileNumber: staffFileNumberSchema,
})

export const updateTeamStaffBodySchema = z.strictObject({
  firstName: staffFirstNameSchema,
  lastName: staffLastNameSchema,
  teamId: staffTeamIdSchema,
  roleInTeam: staffRoleInTeamSchema,
  phoneNumber: staffPhoneNumberSchema,
  version: versionSchema,
})

export const teamStaffSchema = z.strictObject({
  id: z.uuid(),
  userId: z.string(),
  teamId: z.uuid(),
  teamName: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roleInTeam: z.string(),
  phoneNumber: z.string(),
  fileNumber: z.string(),
  isActive: z.boolean(),
  deactivatedAt: z.iso.datetime().nullable(),
  version: versionSchema,
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
})

export const teamStaffListSchema = z.array(teamStaffSchema).readonly()

export type CreateTeamStaffBody = z.infer<typeof createTeamStaffBodySchema>
export type UpdateTeamStaffBody = z.infer<typeof updateTeamStaffBodySchema>
export type TeamStaff = z.infer<typeof teamStaffSchema>
