import { AppError } from '@fia/shared/domain'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RouteErrorFallback } from './route-error-fallback'

describe('RouteErrorFallback', () => {
  it('muestra el mensaje del error y permite reintentar', () => {
    const reset = vi.fn()
    render(<RouteErrorFallback error={new AppError('STALE_VERSION')} reset={reset} />)
    expect(screen.getByText(/Otra persona modificó/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(reset).toHaveBeenCalledOnce()
  })

  it('usa un mensaje genérico para errores desconocidos', () => {
    render(<RouteErrorFallback error={new Error('stack interno')} reset={vi.fn()} />)
    expect(screen.queryByText('stack interno')).not.toBeInTheDocument()
  })
})
