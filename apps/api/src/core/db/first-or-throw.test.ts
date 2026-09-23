import { describe, expect, it } from 'vitest'
import { firstOrThrow } from './first-or-throw'

describe('firstOrThrow', () => {
  it('devuelve la primera fila', () => {
    expect(firstOrThrow([1, 2])).toBe(1)
  })

  it('falla si no hay filas', () => {
    expect(() => firstOrThrow([])).toThrow()
  })
})
