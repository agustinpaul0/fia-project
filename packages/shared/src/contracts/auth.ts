import { z } from 'zod'
import { ROLES } from '../domain/roles'

export const PASSWORD_MIN_LENGTH = 12
export const PASSWORD_MAX_LENGTH = 128
export const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).*$/

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, 'La contraseña debe tener al menos 12 caracteres.')
  .max(PASSWORD_MAX_LENGTH, 'La contraseña no puede superar los 128 caracteres.')
  .regex(PASSWORD_PATTERN, 'La contraseña debe incluir mayúscula, minúscula y número.')

export const emailSchema = z
  .string()
  .trim()
  .email('Ingresá un correo electrónico válido.')
  .toLowerCase()

export const loginBodySchema = z.strictObject({
  email: emailSchema,
  password: z.string().min(1, 'Ingresá tu contraseña.'),
})

export const roleSchema = z.enum(ROLES)

export const authUserSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: roleSchema,
  teamId: z.string().nullable(),
})

export const sessionResponseSchema = z.strictObject({
  user: authUserSchema,
  token: z.string().optional(),
})

export type LoginBody = z.infer<typeof loginBodySchema>
export type AuthUser = z.infer<typeof authUserSchema>
export type SessionResponse = z.infer<typeof sessionResponseSchema>
