import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { aCreateBody, fillCreateForm } from '@/testing/team-staff-form'
import { TeamStaffCreateDialog } from './team-staff-create-dialog'

describe('TeamStaffCreateDialog', () => {
  it('envía los datos del formulario y cierra el diálogo', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onOpenChange = vi.fn()
    const teams = [{ id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }]

    render(
      <TeamStaffCreateDialog
        open={true}
        onOpenChange={onOpenChange}
        teams={teams}
        onSubmit={onSubmit}
      />,
    )

    fillCreateForm(aCreateBody(teams[0]?.id ?? ''))
    const form = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledWith(aCreateBody(teams[0]?.id ?? '')))
    await vi.waitFor(() => expect(onOpenChange).toHaveBeenCalledWith(false))
  })
})
