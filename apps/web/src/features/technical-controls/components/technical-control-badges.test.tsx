import type { TechnicalControlStatus, TechnicalControlType } from '@fia/shared/contracts'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TechnicalControlStatusBadge } from './technical-control-status-badge'
import { TechnicalControlTypeBadge } from './technical-control-type-badge'

describe('Insignias de controles técnicos', () => {
  it.each<[TechnicalControlType, string, string]>([
    ['weight', 'Pesaje', 'bg-indigo-100'],
    ['fuel', 'Combustible', 'bg-amber-100'],
    ['dimensions', 'Dimensiones', 'bg-sky-100'],
    ['engine', 'Motor y Potencia', 'bg-purple-100'],
    ['safety', 'Seguridad', 'bg-teal-100'],
    ['post_race', 'Post-Carrera', 'bg-surface-container'],
  ])('tipo %s se muestra como "%s"', (type, label, color) => {
    render(<TechnicalControlTypeBadge type={type} />)
    expect(screen.getByText(label)).toHaveClass(color)
  })

  it.each<[TechnicalControlStatus, string, string]>([
    ['passed', 'Aprobado', 'bg-emerald-100'],
    ['rejected', 'Rechazado', 'bg-red-100'],
  ])('dictamen %s se muestra como "%s"', (status, label, color) => {
    render(<TechnicalControlStatusBadge status={status} />)
    expect(screen.getByText(label)).toHaveClass(color)
  })
})
