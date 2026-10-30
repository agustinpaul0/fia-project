import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { OfficialBadge } from './official-badge'

describe('OfficialBadge', () => {
  it('muestra la insignia de cuenta oficial por defecto y con etiqueta personalizada', () => {
    const { rerender } = render(<OfficialBadge />)
    expect(screen.getByText(/Cuenta Oficial FIA/)).toBeInTheDocument()

    rerender(<OfficialBadge label="Piloto Oficial" />)
    expect(screen.getByText(/Piloto Oficial/)).toBeInTheDocument()
  })
})
