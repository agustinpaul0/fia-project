import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { RowButton } from './row-button'

describe('RowButton', () => {
  it('usa la etiqueta como nombre y título, y avisa el click', () => {
    const onClick = vi.fn()
    render(
      <RowButton label="Subir" onClick={onClick}>
        ↑
      </RowButton>,
    )
    const button = screen.getByRole('button', { name: 'Subir' })
    expect(button).toHaveAttribute('title', 'Subir')
    expect(button).toHaveAttribute('type', 'button')
    expect(button).toBeEnabled()
    expect(button).toHaveClass('text-primary')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledOnce()
  })

  it('marca en rojo la acción peligrosa y respeta el deshabilitado', () => {
    render(
      <RowButton label="Quitar" danger disabled onClick={vi.fn()}>
        ✕
      </RowButton>,
    )
    const button = screen.getByRole('button', { name: 'Quitar' })
    expect(button).toHaveClass('text-secondary')
    expect(button).toBeDisabled()
  })
})
