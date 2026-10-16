import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aPenalty } from '@/testing/penalty-builders'
import { NO_TEAM_PENALTIES, PenaltiesList } from './penalties-list'

const TEAM_FINE = aPenalty({
  id: '00000000-0000-4000-8000-000000000002',
  teamId: '00000000-0000-4000-8000-000000000011',
  teamName: 'Alpine',
  driverId: null,
  driverName: null,
  raceId: '00000000-0000-4000-8000-000000000030',
  raceName: 'Gran Premio de Mónaco',
  type: 'fine',
  penalty: 'USD 10.000',
  reason: 'Liberación insegura en boxes.',
})

const rowTexts = (): string[] =>
  screen
    .getAllByRole('row')
    .slice(1)
    .map((row) => within(row).getAllByRole('cell')[1]?.textContent ?? '')

describe('PenaltiesList', () => {
  it('muestra a quién, cuándo, en qué carrera y por qué se sancionó', () => {
    render(<PenaltiesList penalties={[aPenalty(), TEAM_FINE]} />)
    const headers = screen.getAllByRole('columnheader').map((h) => h.textContent)
    expect(headers).toEqual(['Fecha / Evento', 'Sancionado', 'Tipo', 'Sanción', 'Motivo'])
    expect(rowTexts()).toEqual(['Charles Leclerc(Ferrari)', 'Alpine (Escudería)'])
    expect(screen.getAllByText('24/5/26, 11:30')).toHaveLength(2)
    expect(screen.getByText('Gran Premio de Mónaco')).toBeInTheDocument()
    expect(screen.getByText('USD 10.000')).toBeInTheDocument()
    expect(screen.getByText('Liberación insegura en boxes.')).toBeInTheDocument()
    expect(screen.getByText('Total de sanciones registradas: 2')).toBeInTheDocument()
  })

  it('filtra por escudería con las escuderías del listado', () => {
    render(<PenaltiesList penalties={[aPenalty(), TEAM_FINE]} />)
    const options = within(screen.getByLabelText('Escudería:')).getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual(['Todas', 'Alpine', 'Ferrari'])
    fireEvent.change(screen.getByLabelText('Escudería:'), { target: { value: TEAM_FINE.teamId } })
    expect(rowTexts()).toEqual(['Alpine (Escudería)'])
    expect(screen.getByText('Total de sanciones registradas: 1')).toBeInTheDocument()
    fireEvent.change(screen.getByLabelText('Escudería:'), { target: { value: '' } })
    expect(rowTexts()).toHaveLength(2)
  })

  it('avisa si otro filtro deja sin sanciones a la escudería elegida', () => {
    const { rerender } = render(<PenaltiesList penalties={[aPenalty(), TEAM_FINE]} />)
    fireEvent.change(screen.getByLabelText('Escudería:'), { target: { value: TEAM_FINE.teamId } })
    rerender(<PenaltiesList penalties={[aPenalty()]} />)
    expect(screen.getByText(NO_TEAM_PENALTIES)).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
