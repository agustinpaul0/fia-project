import { describe, expect, it } from 'vitest'
import { pointsLabel, positionLabel, totalAssigned } from './editor-summary'

describe('resumen del editor de clasificación', () => {
  it('nombra el podio y numera al resto', () => {
    expect([1, 2, 3, 4, 12].map(positionLabel)).toEqual([
      'Piloto ganador',
      'Segundo lugar',
      'Tercer lugar',
      'Clasificado 4°',
      'Clasificado 12°',
    ])
  })

  it('usa singular para un punto', () => {
    expect(pointsLabel(1)).toBe('1 pt')
    expect(pointsLabel(0)).toBe('0 pts')
    expect(pointsLabel(25)).toBe('25 pts')
  })

  it('suma los puntos de las posiciones cargadas según el tipo de carrera', () => {
    expect(totalAssigned('grand_prix', 10)).toBe(101)
    expect(totalAssigned('grand_prix', 12)).toBe(101)
    expect(totalAssigned('sprint', 3)).toBe(21)
    expect(totalAssigned('sprint', 0)).toBe(0)
  })
})
