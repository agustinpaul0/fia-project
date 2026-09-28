import { describe, expect, it } from 'vitest'
import { createTeamStaffBodySchema } from './team-staff'

const VALID = {
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  password: 'Password123!',
  teamId: '00000000-0000-4000-8000-000000000001',
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
}

const firstMessage = (input: unknown): string | undefined =>
  createTeamStaffBodySchema.safeParse(input).error?.issues[0]?.message

describe('contratos de alta de personal de escudería', () => {
  it('acepta un cuerpo válido y normaliza datos', () => {
    const input = {
      ...VALID,
      firstName: ' Charles ',
      lastName: ' Leclerc ',
      email: ' CHARLES@FERRARI.COM ',
      roleInTeam: ' Jefe de Mecánicos ',
      phoneNumber: ' +54 9 291 1234567 ',
      fileNumber: ' leg-1234 ',
    }
    expect(createTeamStaffBodySchema.parse(input)).toEqual(VALID)
  })

  it.each([
    [{ ...VALID, firstName: '' }, 'El nombre es obligatorio.'],
    [{ ...VALID, firstName: 'A'.repeat(61) }, 'El nombre no puede superar los 60 caracteres.'],
    [{ ...VALID, lastName: '' }, 'El apellido es obligatorio.'],
    [{ ...VALID, lastName: 'A'.repeat(61) }, 'El apellido no puede superar los 60 caracteres.'],
    [{ ...VALID, email: 'invalido' }, 'Ingresá un correo electrónico válido.'],
    [{ ...VALID, password: 'corta' }, 'La contraseña debe tener al menos 12 caracteres.'],
    [{ ...VALID, password: 'A'.repeat(129) }, 'La contraseña no puede superar los 128 caracteres.'],
    [
      { ...VALID, password: 'solominusculas' },
      'La contraseña debe incluir mayúscula, minúscula y número.',
    ],
    [{ ...VALID, teamId: 'no-uuid' }, 'El identificador de escudería debe ser un UUID válido.'],
    [{ ...VALID, roleInTeam: 'A' }, 'El cargo debe tener al menos 2 caracteres.'],
    [{ ...VALID, roleInTeam: 'A'.repeat(61) }, 'El cargo no puede superar los 60 caracteres.'],
    [
      { ...VALID, phoneNumber: '123456' },
      'El teléfono debe tener entre 7 y 30 caracteres válidos.',
    ],
    [
      { ...VALID, phoneNumber: '1'.repeat(31) },
      'El teléfono debe tener entre 7 y 30 caracteres válidos.',
    ],
    [
      { ...VALID, phoneNumber: '+54-abc-123' },
      'El teléfono debe tener entre 7 y 30 caracteres válidos.',
    ],
    [
      { ...VALID, fileNumber: '' },
      'El legajo debe contener entre 1 y 20 caracteres alfanuméricos o guiones.',
    ],
    [
      { ...VALID, fileNumber: 'A'.repeat(21) },
      'El legajo debe contener entre 1 y 20 caracteres alfanuméricos o guiones.',
    ],
    [
      { ...VALID, fileNumber: 'LEG_01' },
      'El legajo debe contener entre 1 y 20 caracteres alfanuméricos o guiones.',
    ],
  ])('rechaza entrada inválida con mensaje específico', (body, message) => {
    expect(firstMessage(body)).toBe(message)
  })

  it('rechaza campos desconocidos', () => {
    expect(createTeamStaffBodySchema.safeParse({ ...VALID, extra: 'bad' }).success).toBe(false)
  })
})
