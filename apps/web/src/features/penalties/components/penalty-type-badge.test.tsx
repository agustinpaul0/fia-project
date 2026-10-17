import type { PenaltyType } from '@fia/shared/contracts'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PenaltyTypeBadge } from './penalty-type-badge'

describe('PenaltyTypeBadge', () => {
  it.each<[PenaltyType, string, string]>([
    ['time_penalty', 'Recargo de tiempo', 'bg-amber-100'],
    ['grid_penalty', 'Puestos en grilla', 'bg-sky-100'],
    ['points_deduction', 'Quita de puntos', 'bg-orange-100'],
    ['disqualification', 'Descalificación', 'bg-red-100'],
    ['fine', 'Multa económica', 'bg-emerald-100'],
    ['reprimand', 'Apercibimiento', 'bg-surface-container'],
  ])('muestra %s como "%s"', (type, label, color) => {
    render(<PenaltyTypeBadge type={type} />)
    expect(screen.getByText(label)).toHaveClass(color)
  })
})
