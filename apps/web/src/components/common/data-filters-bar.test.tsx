import { fireEvent, render, screen, within } from '@testing-library/react'
import { type ReactNode, useEffect } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { DataFiltersBar, EMPTY_FILTERS_MESSAGE } from './data-filters-bar'
import { type CommonFilterQuery, RANGE_ERROR, useCommonFilters } from './use-common-filters'

const Harness = ({ onQuery }: { readonly onQuery: (q: CommonFilterQuery) => void }): ReactNode => {
  const filters = useCommonFilters({ season: 2026 })
  useEffect(() => onQuery(filters.query))
  return <DataFiltersBar filters={filters} now={new Date('2026-10-31T12:00:00Z')} />
}

const setup = () => {
  const onQuery = vi.fn()
  render(<Harness onQuery={onQuery} />)
  const last = (): CommonFilterQuery => onQuery.mock.lastCall?.[0] ?? {}
  return { last }
}

describe('DataFiltersBar (US-3)', () => {
  it('ofrece la temporada actual y las 5 anteriores, con la actual elegida', () => {
    const { last } = setup()
    const options = within(screen.getByLabelText('Temporada:')).getAllByRole('option')
    expect(options.map((o) => o.textContent)).toEqual([
      'Todas',
      '2026',
      '2025',
      '2024',
      '2023',
      '2022',
      '2021',
    ])
    expect(last().season).toBe(2026)
  })

  it('convierte el rango de días a UTC en hora argentina y combina con el orden', () => {
    const { last } = setup()
    fireEvent.change(screen.getByLabelText('Desde:'), { target: { value: '2026-03-01' } })
    fireEvent.change(screen.getByLabelText('Hasta:'), { target: { value: '2026-03-31' } })
    fireEvent.change(screen.getByLabelText('Orden:'), { target: { value: 'date_asc' } })
    expect(last()).toEqual({
      season: 2026,
      from: '2026-03-01T03:00:00.000Z',
      to: '2026-04-01T02:59:59.999Z',
      sort: 'date_asc',
    })
  })

  it('avisa un rango invertido y no lo envía', () => {
    const { last } = setup()
    fireEvent.change(screen.getByLabelText('Desde:'), { target: { value: '2026-05-01' } })
    fireEvent.change(screen.getByLabelText('Hasta:'), { target: { value: '2026-04-01' } })
    expect(screen.getByRole('alert')).toHaveTextContent(RANGE_ERROR)
    expect(last().from).toBeUndefined()
  })

  it('limpia todos los filtros con un solo botón', () => {
    const { last } = setup()
    fireEvent.change(screen.getByLabelText('Desde:'), { target: { value: '2026-05-01' } })
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(last()).toEqual({ season: undefined, from: undefined, to: undefined, sort: undefined })
    expect(screen.queryByRole('button', { name: 'Limpiar filtros' })).toBeNull()
    expect(EMPTY_FILTERS_MESSAGE).toBe('Sin resultados.')
  })
})
