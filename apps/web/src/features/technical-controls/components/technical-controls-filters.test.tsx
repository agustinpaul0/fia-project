import { fireEvent, render, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it, vi } from 'vitest'
import { useCommonFilters } from '@/components/common/use-common-filters'
import { TechnicalControlsFilters } from './technical-controls-filters'

type Handlers = { readonly onControlTypeChange: () => void; readonly onStatusChange: () => void }

const Harness = (h: Handlers): ReactNode => (
  <TechnicalControlsFilters filters={useCommonFilters()} selectedStatus="passed" {...h} />
)

describe('TechnicalControlsFilters', () => {
  it('avisa tipo y resultado, y los limpia con el botón común', () => {
    const h = { onControlTypeChange: vi.fn(), onStatusChange: vi.fn() }
    render(<Harness {...h} />)
    fireEvent.change(screen.getByLabelText(/Tipo/), { target: { value: 'fuel' } })
    expect(h.onControlTypeChange).toHaveBeenLastCalledWith('fuel')
    fireEvent.change(screen.getByLabelText(/Resultado/), { target: { value: 'rejected' } })
    expect(h.onStatusChange).toHaveBeenLastCalledWith('rejected')
    fireEvent.click(screen.getByRole('button', { name: 'Limpiar filtros' }))
    expect(h.onControlTypeChange).toHaveBeenLastCalledWith(undefined)
    expect(h.onStatusChange).toHaveBeenLastCalledWith(undefined)
  })
})
