import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aRaceSummary } from '@/testing/race-builders'
import { renderWithRouter } from '@/testing/render-with-router'
import { AdminRaceHero } from './admin-race-hero'
import { AdminRaceTicker, publicationLabel } from './admin-race-ticker'

describe('encabezado del editor de resultados', () => {
  it('describe la revisión publicada', () => {
    expect(publicationLabel(0)).toBe('Sin publicar desde el sistema')
    expect(publicationLabel(3)).toBe('Revisión 3 publicada')
  })

  it('muestra la ruta, la temporada, la ronda y el estado de publicación', async () => {
    renderWithRouter(<AdminRaceTicker race={aRaceSummary({ round: 7, resultsRevision: 2 })} />)
    expect(await screen.findByRole('link', { name: 'Carga de resultados' })).toHaveAttribute(
      'href',
      '/admin/results',
    )
    expect(screen.getByText('Temporada 2025')).toBeInTheDocument()
    expect(screen.getByText('F1 - R07')).toBeInTheDocument()
    expect(screen.getByText('Modo edición activo')).toBeInTheDocument()
    expect(screen.getByText('Revisión 2 publicada')).toBeInTheDocument()
  })

  it('muestra los datos de la carrera con la fecha en hora argentina', async () => {
    renderWithRouter(<AdminRaceHero race={aRaceSummary({ type: 'sprint', round: 4 })} />)
    expect(
      await screen.findByRole('heading', { name: 'Gran Premio de Mónaco 2025' }),
    ).toBeInTheDocument()
    expect(screen.getByText('Sprint · Ronda 04')).toBeInTheDocument()
    expect(screen.getAllByText('Circuit de Monaco')[0]).toBeInTheDocument()
    expect(screen.getByText('Monaco')).toBeInTheDocument()
    expect(screen.getByText('F1')).toBeInTheDocument()
    expect(screen.getByText('2025')).toBeInTheDocument()
    expect(screen.getByText('25/05/2025 · 10:00')).toHaveClass('text-secondary')
  })
})
