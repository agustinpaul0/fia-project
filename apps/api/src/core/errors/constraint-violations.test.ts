import { describe, expect, it } from 'vitest'
import { translateConstraintViolations } from './constraint-violations'

const MAP = { things_name_unique: 'CATEGORY_ALREADY_EXISTS' } as const

const failWith = (error: unknown) => () => Promise.reject(error)

describe('translateConstraintViolations', () => {
  it('devuelve el resultado si la operación no falla', async () => {
    expect(await translateConstraintViolations(MAP, () => Promise.resolve(7))).toBe(7)
  })

  it('traduce la restricción aunque venga anidada en cause', async () => {
    const error = new Error('wrap', { cause: { constraint: 'things_name_unique' } })
    await expect(translateConstraintViolations(MAP, failWith(error))).rejects.toMatchObject({
      code: 'CATEGORY_ALREADY_EXISTS',
    })
  })

  it('relanza el error original si la restricción no está mapeada', async () => {
    const error = { constraint: 'otra' }
    await expect(translateConstraintViolations(MAP, failWith(error))).rejects.toBe(error)
  })

  it('ignora constraint que no sea texto y sigue buscando en cause', async () => {
    const error = { constraint: 42, cause: { constraint: 'things_name_unique' } }
    await expect(translateConstraintViolations(MAP, failWith(error))).rejects.toMatchObject({
      code: 'CATEGORY_ALREADY_EXISTS',
    })
  })

  it('relanza null sin romperse', async () => {
    await expect(translateConstraintViolations(MAP, failWith(null))).rejects.toBeNull()
  })

  it('relanza valores que no son objetos', async () => {
    await expect(translateConstraintViolations(MAP, failWith('texto'))).rejects.toBe('texto')
  })
})
