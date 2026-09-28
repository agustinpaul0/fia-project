import { describe, expect, it } from 'vitest'
import {
  addRow,
  driverIdsOf,
  EMPTY_SLOT,
  isComplete,
  moveRow,
  removeRow,
  setRow,
  toDraftRows,
} from './classification-draft'

const ids = (rows: Parameters<typeof driverIdsOf>[0]) => driverIdsOf(rows)

describe('borrador de clasificación', () => {
  it('agrega un lugar vacío al final', () => {
    expect(addRow(toDraftRows(['a']), 'k')).toEqual([
      { key: 'a', driverId: 'a' },
      { key: 'k', driverId: EMPTY_SLOT },
    ])
  })

  it('quita la posición indicada', () => {
    expect(ids(removeRow(toDraftRows(['a', 'b', 'c']), 1))).toEqual(['a', 'c'])
  })

  it('elige un piloto sólo en la posición indicada', () => {
    expect(ids(setRow(toDraftRows(['a', 'b']), { index: 1, driverId: 'z' }))).toEqual(['a', 'z'])
  })

  it('sube y baja posiciones intercambiando pilotos', () => {
    expect(ids(moveRow(toDraftRows(['a', 'b', 'c']), { index: 1, offset: -1 }))).toEqual([
      'b',
      'a',
      'c',
    ])
    expect(ids(moveRow(toDraftRows(['a', 'b', 'c']), { index: 1, offset: 1 }))).toEqual([
      'a',
      'c',
      'b',
    ])
  })

  it('no mueve fuera de los límites', () => {
    expect(ids(moveRow(toDraftRows(['a', 'b']), { index: 0, offset: -1 }))).toEqual(['a', 'b'])
    expect(ids(moveRow(toDraftRows(['a', 'b']), { index: 1, offset: 1 }))).toEqual(['a', 'b'])
  })

  it('está completo sólo si hay pilotos y ninguno vacío', () => {
    expect(isComplete(toDraftRows([]))).toBe(false)
    expect(isComplete(toDraftRows(['a', EMPTY_SLOT]))).toBe(false)
    expect(isComplete(toDraftRows(['a', 'b']))).toBe(true)
  })
})
