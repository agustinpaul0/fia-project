import { describe, expect, it } from 'vitest'
import { MAX_POINTS_PER_RACE, POINTS_BY_RACE_TYPE, pointsFor } from './scoring'

describe('escala de puntos oficial', () => {
  it.each([
    [1, 25],
    [2, 18],
    [3, 15],
    [4, 12],
    [5, 10],
    [6, 8],
    [7, 6],
    [8, 4],
    [9, 2],
    [10, 1],
    [11, 0],
  ])('Gran Premio: posición %i suma %i', (position, points) => {
    expect(pointsFor('grand_prix', position)).toBe(points)
  })

  it.each([
    [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 3],
    [7, 2],
    [8, 1],
    [9, 0],
  ])('Sprint: posición %i suma %i', (position, points) => {
    expect(pointsFor('sprint', position)).toBe(points)
  })

  it('ninguna escala supera el máximo por carrera', () => {
    const all = Object.values(POINTS_BY_RACE_TYPE).flat()
    expect(Math.max(...all)).toBe(MAX_POINTS_PER_RACE)
  })
})
