import {
  type CreateTeamStaffBody,
  createTeamStaffBodySchema,
  type UpdateTeamStaffBody,
  updateTeamStaffBodySchema,
} from '@fia/shared/contracts'
import type { z } from 'zod'

export const createStaffFormSchema = createTeamStaffBodySchema
export const editStaffFormSchema = updateTeamStaffBodySchema.omit({ version: true })

export type CreateInput = z.input<typeof createStaffFormSchema>
export type EditInput = z.input<typeof editStaffFormSchema>
export type EditOutput = Omit<UpdateTeamStaffBody, 'version'>

export const CREATE_FIELDS = [
  'firstName',
  'lastName',
  'email',
  'password',
  'teamId',
  'roleInTeam',
  'phoneNumber',
  'fileNumber',
] as const satisfies readonly (keyof CreateTeamStaffBody)[]

export const EDIT_FIELDS = [
  'firstName',
  'lastName',
  'teamId',
  'roleInTeam',
  'phoneNumber',
] as const satisfies readonly (keyof EditOutput)[]

export const EMPTY_CREATE: CreateInput = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  teamId: '',
  roleInTeam: '',
  phoneNumber: '',
  fileNumber: '',
}
