import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TechnicalControlsFilters } from './technical-controls-filters'

describe('TechnicalControlsFilters', () => {
  it('dispara onSeasonChange con número y con undefined', () => {
    const onSeasonChange = vi.fn()
    render(
      <TechnicalControlsFilters
        selectedSeason={2026}
        onSeasonChange={onSeasonChange}
        onControlTypeChange={vi.fn()}
        onStatusChange={vi.fn()}
      />,
    )
    const select = screen.getByLabelText(/Temporada/)
    fireEvent.change(select, { target: { value: '2025' } })
    expect(onSeasonChange).toHaveBeenCalledWith(2025)

    fireEvent.change(select, { target: { value: '' } })
    expect(onSeasonChange).toHaveBeenCalledWith(undefined)
  })

  it('dispara onControlTypeChange con tipo y con undefined', () => {
    const onControlTypeChange = vi.fn()
    render(
      <TechnicalControlsFilters
        selectedControlType="weight"
        onSeasonChange={vi.fn()}
        onControlTypeChange={onControlTypeChange}
        onStatusChange={vi.fn()}
      />,
    )
    const select = screen.getByLabelText(/Tipo/)
    fireEvent.change(select, { target: { value: 'fuel' } })
    expect(onControlTypeChange).toHaveBeenCalledWith('fuel')

    fireEvent.change(select, { target: { value: '' } })
    expect(onControlTypeChange).toHaveBeenCalledWith(undefined)
  })

  it('dispara onStatusChange con status y con undefined', () => {
    const onStatusChange = vi.fn()
    render(
      <TechnicalControlsFilters
        selectedStatus="passed"
        onSeasonChange={vi.fn()}
        onControlTypeChange={vi.fn()}
        onStatusChange={onStatusChange}
      />,
    )
    const select = screen.getByLabelText(/Resultado/)
    fireEvent.change(select, { target: { value: 'rejected' } })
    expect(onStatusChange).toHaveBeenCalledWith('rejected')

    fireEvent.change(select, { target: { value: '' } })
    expect(onStatusChange).toHaveBeenCalledWith(undefined)
  })
})
