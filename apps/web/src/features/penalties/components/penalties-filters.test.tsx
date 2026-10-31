import { fireEvent, render, screen, within } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useCommonFilters } from '@/components/common/use-common-filters'
import { PenaltiesFilters } from './penalties-filters'

const Harness = ({ onTypeChange }: { readonly onTypeChange: () => void }): ReactNode => (
  <PenaltiesFilters filters={useCommonFilters()} selectedType="fine" onTypeChange={onTypeChange} />
)

describe('PenaltiesFilters', () => {
  it('ofrece todos los tipos y los limpia junto con los filtros comunes', () => {
    const onTypeChange = vi.fn()
    render(<Harness onTypeChange={onTypeChange} />)
    expect(within(screen.getByLabelText('Tipo:')).getAllByRole('option')).toHaveLength(7)
    expect(screen.getByLabelText('Tipo:')).toHaveValue('fine')
    fireEvent.change(screen.getByLabelText('Tipo:'), { target: { value: 'reprimand' } })
    expect(onTypeChange).toHaveBeenLastCalledWith('reprimand')
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(onTypeChange).toHaveBeenLastCalledWith(undefined)
  })
})
