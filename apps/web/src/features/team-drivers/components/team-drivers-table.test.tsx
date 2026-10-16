import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aDriver } from '@/testing/driver-builders'
import { NO_DRIVERS_MESSAGE, TeamDriversTable } from './team-drivers-table'

const RESERVE = aDriver({
  id: '00000000-0000-4000-8000-000000000003',
  firstName: 'Oliver',
  lastName: 'Bearman',
  code: 'BEA',
  number: 87,
  country: 'Reino Unido',
  license: null,
  role: 'reserve',
})

describe('TeamDriversTable', () => {
  it('muestra los encabezados de la nómina', () => {
    render(<TeamDriversTable drivers={[]} />)
    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent)
    expect(headers).toEqual(['Dorsal', 'Piloto', 'Código', 'Nacionalidad', 'Licencia', 'Condición'])
  })

  it('muestra cada piloto con su dorsal, datos, licencia y condición', () => {
    render(<TeamDriversTable drivers={[aDriver(), RESERVE]} />)
    const [, first, second] = screen.getAllByRole('row')
    const cellsOf = (row: HTMLElement | undefined) =>
      within(row ?? document.body)
        .getAllByRole('cell')
        .map((c) => c.textContent)
    expect(cellsOf(first)).toEqual([
      '#16',
      'Charles Leclerc',
      'LEC',
      'Mónaco',
      'FIA-16-LEC',
      'Titular',
    ])
    expect(cellsOf(second)).toEqual([
      '#87',
      'Oliver Bearman',
      'BEA',
      'Reino Unido',
      '—',
      'Suplente',
    ])
  })

  it('distingue visualmente titulares de suplentes', () => {
    render(<TeamDriversTable drivers={[aDriver(), RESERVE]} />)
    expect(screen.getByText('Titular')).toHaveClass('bg-green-100')
    expect(screen.getByText('Suplente')).toHaveClass('bg-blue-100')
  })

  it('resume el total de titulares y suplentes', () => {
    render(<TeamDriversTable drivers={[aDriver(), aDriver({ id: 'x', role: 'main' }), RESERVE]} />)
    expect(screen.getByText('Total inscriptos: 3 (2 titulares, 1 suplentes)')).toBeInTheDocument()
    expect(screen.queryByText(NO_DRIVERS_MESSAGE)).not.toBeInTheDocument()
  })

  it('avisa cuando la escudería no tiene pilotos', () => {
    render(<TeamDriversTable drivers={[]} />)
    expect(screen.getByText(NO_DRIVERS_MESSAGE)).toBeInTheDocument()
    expect(screen.getByText('Total inscriptos: 0 (0 titulares, 0 suplentes)')).toBeInTheDocument()
  })
})
