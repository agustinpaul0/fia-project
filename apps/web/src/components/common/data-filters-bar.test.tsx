import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { DataFiltersBar, EMPTY_FILTERS_MESSAGE } from './data-filters-bar'

describe('DataFiltersBar (US-3)', () => {
  it('permite cambiar temporada y limpiar los filtros aplicados con un clic', () => {
    const onSeasonChange = vi.fn()
    const onReset = vi.fn()

    render(
      <DataFiltersBar
        selectedSeason={2026}
        onSeasonChange={onSeasonChange}
        hasActiveFilters={true}
        onReset={onReset}
      />,
    )

    fireEvent.change(screen.getByLabelText('Temporada:'), { target: { value: '2025' } })
    expect(onSeasonChange).toHaveBeenCalledWith(2025)

    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(onReset).toHaveBeenCalledTimes(1)
    expect(EMPTY_FILTERS_MESSAGE).toContain('Sin resultados')
  })
})
