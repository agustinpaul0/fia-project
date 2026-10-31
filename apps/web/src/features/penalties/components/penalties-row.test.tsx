import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { formatDateTime } from '@/lib/format-date-time'
import { aPenalty } from '@/testing/penalty-builders'
import { PenaltiesTable } from './penalties-table'

describe('Estado de notificación de la sanción (US-15)', () => {
  it('muestra a la FIA quién confirmó y cuándo (hora argentina)', () => {
    const confirmed = aPenalty({
      notificationStatus: 'confirmed',
      confirmedAt: '2026-05-25T13:00:00.000Z',
      confirmedByName: 'Fred Vasseur',
    })
    render(<PenaltiesTable penalties={[confirmed]} />)
    expect(screen.getByText('Notificada')).toBeInTheDocument()
    const expected = `Fred Vasseur · ${formatDateTime('2026-05-25T13:00:00.000Z')}`
    expect(screen.getByText(expected)).toHaveTextContent('10:00')
  })

  it('una pendiente se muestra como Pendiente sin datos de confirmación', () => {
    render(<PenaltiesTable penalties={[aPenalty({ notificationStatus: 'pending' })]} />)
    expect(screen.getByText('Pendiente')).toBeInTheDocument()
    expect(screen.queryByText(/·/)).toBeNull()
  })
})
