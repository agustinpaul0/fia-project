import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { RACE_TYPE_LABELS, RaceTypeBadge } from './race-type-badge'

describe('RaceTypeBadge', () => {
  it('abrevia el Gran Premio en amarillo con el nombre completo como título', () => {
    render(<RaceTypeBadge type="grand_prix" className="extra" />)
    const abbr = screen.getByTitle('Gran Premio')
    expect(abbr).toHaveTextContent('GP')
    expect(abbr.parentElement).toHaveClass('bg-primary-container', 'extra')
  })

  it('muestra el Sprint en azul', () => {
    render(<RaceTypeBadge type="sprint" />)
    expect(screen.getByTitle('Sprint').parentElement).toHaveClass('bg-tertiary')
    expect(RACE_TYPE_LABELS).toEqual({ grand_prix: 'Gran Premio', sprint: 'Sprint' })
  })
})
