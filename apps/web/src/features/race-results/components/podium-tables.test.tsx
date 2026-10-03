import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aDriverStanding, aResult } from '@/testing/race-builders'
import { ClassificationTable } from './classification-table'
import { StandingsTable } from './standings-table'

describe('tablas con podio', () => {
  it('destaca el podio del campeonato y los puntos del líder', () => {
    const standings = [1, 2, 3, 4].map((n) => aDriverStanding(n, { wins: 7 }))
    render(<StandingsTable standings={standings} />)
    expect(screen.getByText('1')).toHaveClass('bg-primary-container', 'h-7')
    expect(screen.getByText('2')).toHaveClass('bg-surface-container-highest')
    expect(screen.getByText('3')).toHaveClass('bg-secondary-fixed')
    expect(screen.getByText('4')).not.toHaveClass('h-7')
    expect(screen.getByText('95 pts')).toHaveClass('bg-primary-container')
    expect(screen.getByText('90 pts')).toHaveClass('bg-surface-container-high')
    expect(screen.getByText('85 pts')).toHaveClass('bg-surface-container-high')
    expect(screen.getByText('80 pts')).toHaveClass('bg-surface-container')
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Pos.',
      'Piloto',
      'Escudería',
      'Victorias',
      'Puntos',
    ])
  })

  it('destaca el podio de la carrera', () => {
    render(<ClassificationTable results={[1, 2, 3, 4].map((n) => aResult(n, 30 - n))} />)
    expect(screen.getByText('1')).toHaveClass('bg-primary-container')
    expect(screen.getByText('2')).toHaveClass('bg-surface-variant')
    expect(screen.getByText('3')).toHaveClass('bg-secondary-container')
    expect(screen.getByText('4')).not.toHaveClass('h-7')
    expect(screen.getByText('Piloto 1')).toHaveClass('font-headline')
    expect(screen.getByText('Piloto 4')).toHaveClass('font-medium')
    expect(screen.getAllByRole('columnheader').map((h) => h.textContent)).toEqual([
      'Pos.',
      'Piloto',
      'Escudería',
      'Puntos',
    ])
  })
})
