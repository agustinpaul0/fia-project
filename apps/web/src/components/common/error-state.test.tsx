import { AppError } from '@fia/shared/domain'
import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ErrorState } from './error-state'

describe('ErrorState', () => {
  it('invoca onRetry al reintentar', () => {
    const onRetry = vi.fn()
    render(<ErrorState error={new AppError('FORBIDDEN')} onRetry={onRetry} />)
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(onRetry).toHaveBeenCalledOnce()
  })

  it('no ofrece reintentar si no hay acción posible', () => {
    render(<ErrorState error={new AppError('FORBIDDEN')} onRetry={null} />)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
