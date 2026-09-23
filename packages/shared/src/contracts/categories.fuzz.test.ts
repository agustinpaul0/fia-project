import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { CATEGORY_CODE_PATTERN, createCategoryBodySchema } from './categories'

const validName = fc
  .string({ minLength: 2, maxLength: 60 })
  .filter((name) => name.trim().length >= 2)

const validCode = fc.stringMatching(CATEGORY_CODE_PATTERN)

describe('fuzz de contratos de categorías', () => {
  it('todo par nombre/código válido es aceptado', () => {
    fc.assert(
      fc.property(validName, validCode, (name, code) => {
        expect(createCategoryBodySchema.safeParse({ name, code }).success).toBe(true)
      }),
    )
  })

  it('safeParse nunca lanza excepciones con entradas arbitrarias', () => {
    fc.assert(
      fc.property(fc.anything(), (input) => {
        expect(() => createCategoryBodySchema.safeParse(input)).not.toThrow()
      }),
    )
  })
})
