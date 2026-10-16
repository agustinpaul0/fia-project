import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aTechnicalControl } from '@/testing/technical-control-builders'
import { TechnicalControlsRow } from './technical-controls-row'

const cellsOf = (control = aTechnicalControl()): string[] => {
  render(
    <table>
      <tbody>
        <TechnicalControlsRow control={control} />
      </tbody>
    </table>,
  )
  return within(screen.getByRole('row'))
    .getAllByRole('cell')
    .map((c) => c.textContent ?? '')
}

describe('TechnicalControlsRow', () => {
  it('muestra fecha y hora, vehículo, tipo, dictamen y vigencia del control', () => {
    expect(cellsOf()).toEqual([
      '24/5/26, 11:30',
      'McLarenAuto #4',
      'Combustible',
      'Rechazado',
      '31/5/26, 11:30',
      '—',
    ])
  })

  it('agrega la carrera, el piloto y las observaciones cuando existen', () => {
    const cells = cellsOf(
      aTechnicalControl({
        raceName: 'Gran Premio de Mónaco',
        driverName: 'Lando Norris',
        notes: 'Combustible fuera de norma.',
      }),
    )
    expect(cells[0]).toBe('24/5/26, 11:30Gran Premio de Mónaco')
    expect(cells[1]).toBe('McLarenAuto #4Lando Norris')
    expect(cells[5]).toBe('Combustible fuera de norma.')
  })
})
