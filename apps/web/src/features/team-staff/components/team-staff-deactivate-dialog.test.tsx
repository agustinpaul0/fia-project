import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffDeactivateDialog } from './team-staff-deactivate-dialog'

describe('TeamStaffDeactivateDialog', () => {
  const member = aTeamStaffMember()

  it('no hace nada si member es null', () => {
    const onConfirm = vi.fn()
    render(<TeamStaffDeactivateDialog member={null} onOpenChange={vi.fn()} onConfirm={onConfirm} />)
    expect(screen.queryByText(/Dar de baja cuenta de personal/)).not.toBeInTheDocument()
  })

  it('muestra datos del integrante y confirma la baja', async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    render(
      <TeamStaffDeactivateDialog
        member={member}
        onOpenChange={onOpenChange}
        onConfirm={onConfirm}
      />,
    )

    expect(screen.getByText(/Dar de baja cuenta de personal/)).toBeInTheDocument()
    expect(screen.getByText(/Legajo: LEG-1234/)).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    expect(onConfirm).toHaveBeenCalledWith(member.id, member.version)
  })

  it('muestra error si la baja falla con Error o texto plano', async () => {
    const onConfirm = vi
      .fn()
      .mockRejectedValueOnce(new Error('Versión obsoleta'))
      .mockRejectedValueOnce('fallo')
    render(
      <TeamStaffDeactivateDialog member={member} onOpenChange={vi.fn()} onConfirm={onConfirm} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    expect(await screen.findByText('Versión obsoleta')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    expect(await screen.findByText('Error al dar de baja el integrante')).toBeInTheDocument()
  })
})
