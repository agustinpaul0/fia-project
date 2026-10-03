import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aScoreNotification } from '@/testing/notification-builders'
import { AuditHero } from './audit-hero'
import { AuditRow } from './audit-row'

const renderRow = (item = aScoreNotification(), index = 0) =>
  render(
    <table>
      <tbody>
        <AuditRow item={item} index={index} />
      </tbody>
    </table>,
  )

describe('partes de la auditoría', () => {
  it('muestra totales y porcentajes con su color', () => {
    render(
      <AuditHero
        stats={{ total: 4, confirmed: 3, pending: 1, confirmedPct: 75, pendingPct: 25 }}
      />,
    )
    expect(screen.getByText('Total').parentElement).toHaveTextContent('Total4regs')
    expect(screen.getByText('Confirmadas').parentElement).toHaveTextContent('Confirmadas375%')
    expect(screen.getByText('Confirmadas').parentElement).toHaveClass('bg-[#e8f7ee]')
    expect(screen.getByText('Pendientes').parentElement).toHaveTextContent('Pendientes125%')
    expect(screen.getByText('Pendientes').parentElement).toHaveClass('bg-[#fff4cc]')
    expect(screen.getByRole('heading', { name: 'Confirmaciones de puntajes' })).toBeInTheDocument()
  })

  it('muestra guiones mientras no hay datos', () => {
    render(<AuditHero stats={null} />)
    expect(screen.getAllByText('—')).toHaveLength(3)
    expect(screen.getAllByText('0%')).toHaveLength(2)
  })

  it('resalta una notificación pendiente y numera con dos dígitos', () => {
    renderRow(aScoreNotification({ teamName: 'Scuderia Ferrari', resultsRevision: 2 }), 8)
    const row = screen.getByRole('row')
    expect(row).toHaveClass('bg-[#fffbeb]')
    expect(screen.getByText('09')).toHaveClass('bg-primary-container')
    expect(screen.getByText('Temporada 2025')).toBeInTheDocument()
    expect(screen.getByText('Puntaje corregido (revisión 2)')).toHaveClass('bg-primary-container')
    expect(screen.getByText('Scuderia Ferrari').previousElementSibling).toHaveClass('bg-[#e8002d]')
    expect(screen.getByText('Pendiente')).toHaveClass('bg-primary-container')
    expect(screen.getByText('Notificación enviada')).toBeInTheDocument()
  })

  it('muestra quién confirmó una notificación confirmada', () => {
    const confirmed = aScoreNotification({
      status: 'confirmed',
      confirmedAt: '2025-05-26T13:30:00.000Z',
      confirmedByName: 'Ana Pérez',
    })
    renderRow(confirmed)
    expect(screen.getByRole('row')).not.toHaveClass('bg-[#fffbeb]')
    expect(screen.getByText('01')).toHaveClass('bg-surface-container-low')
    expect(screen.getByText('Puntaje publicado')).toHaveClass('bg-surface-container-high')
    expect(screen.getByText('Confirmada')).toHaveClass('bg-[#d4f5df]')
    expect(screen.getByText('Ana Pérez')).toBeInTheDocument()
    expect(screen.getByText('26/5/25, 10:30')).toBeInTheDocument()
  })
})
