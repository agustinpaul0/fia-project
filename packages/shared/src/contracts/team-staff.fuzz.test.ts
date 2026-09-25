import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { createTeamStaffBodySchema, FILE_NUMBER_PATTERN, PHONE_NUMBER_PATTERN } from './team-staff'

const validName = fc.string({ minLength: 1, maxLength: 60 }).filter((s) => s.trim().length >= 1)
const validEmail = fc.stringMatching(/^[a-z0-9]{2,10}@[a-z0-9]{2,10}\.[a-z]{2,4}$/)
const validRole = fc.string({ minLength: 2, maxLength: 60 }).filter((s) => s.trim().length >= 2)
const validPhone = fc
  .stringMatching(PHONE_NUMBER_PATTERN)
  .filter((s) => s.trim().length >= 7 && s.trim().length <= 30)
const validFile = fc.stringMatching(FILE_NUMBER_PATTERN).filter((s) => s.trim().length >= 1)

const validStaffRecord = fc.record({
  firstName: validName,
  lastName: validName,
  email: validEmail,
  teamId: fc.uuid(),
  roleInTeam: validRole,
  phoneNumber: validPhone,
  fileNumber: validFile,
})

describe('fuzz de contratos de personal de escudería', () => {
  it('toda entrada válida es aceptada', () => {
    fc.assert(
      fc.property(validStaffRecord, (data) => {
        const body = { ...data, password: 'Password123!' }
        expect(createTeamStaffBodySchema.safeParse(body).success).toBe(true)
      }),
    )
  })

  it('safeParse nunca lanza excepciones con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => createTeamStaffBodySchema.safeParse(input)).not.toThrow()
      }),
    )
  })
})
