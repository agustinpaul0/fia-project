import { fireEvent, render, screen, within } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { PenaltiesFilters } from './penalties-filters'

const renderFilters = () => {
  const onSeasonChange = vi.fn()
  const onTypeChange = vi.fn()
  render(
    <PenaltiesFilters
      selectedSeason={2025}
      selectedType="fine"
      onSeasonChange={onSeasonChange}
      onTypeChange={onTypeChange}
    />,
  )
  return { onSeasonChange, onTypeChange }
}

describe('PenaltiesFilters', () => {
  it('ofrece las temporadas de los últimos 5 años y todos los tipos', () => {
    renderFilters()
    const seasons = within(screen.getByLabelText('Temporada:')).getAllByRole('option')
    expect(seasons.map((o) => o.textContent)).toEqual([
      'Todas',
      '2026',
      '2025',
      '2024',
      '2023',
      '2022',
      '2021',
    ])
    expect(within(screen.getByLabelText('Tipo:')).getAllByRole('option')).toHaveLength(7)
    expect(screen.getByLabelText('Temporada:')).toHaveValue('2025')
    expect(screen.getByLabelText('Tipo:')).toHaveValue('fine')
  })

  it('avisa los cambios y vuelve a "todos" con la opción vacía', () => {
    const { onSeasonChange, onTypeChange } = renderFilters()
    fireEvent.change(screen.getByLabelText('Temporada:'), { target: { value: '2023' } })
    expect(onSeasonChange).toHaveBeenLastCalledWith(2023)
    fireEvent.change(screen.getByLabelText('Temporada:'), { target: { value: '' } })
    expect(onSeasonChange).toHaveBeenLastCalledWith(undefined)
    fireEvent.change(screen.getByLabelText('Tipo:'), { target: { value: 'reprimand' } })
    expect(onTypeChange).toHaveBeenLastCalledWith('reprimand')
    fireEvent.change(screen.getByLabelText('Tipo:'), { target: { value: '' } })
    expect(onTypeChange).toHaveBeenLastCalledWith(undefined)
  })
})
