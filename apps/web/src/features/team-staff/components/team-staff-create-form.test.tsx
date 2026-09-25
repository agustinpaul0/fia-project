import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamStaffCreateForm } from './team-staff-create-form'

describe('TeamStaffCreateForm', () => {
  const teams = [{ id: '00000000-0000-4000-8000-000000000001', name: 'Ferrari' }]

  it('completa los campos y envía el formulario', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()
    render(<TeamStaffCreateForm teams={teams} onCancel={onCancel} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText('Nombre'), { target: { value: 'Charles' } })
    fireEvent.change(screen.getByLabelText('Apellido'), { target: { value: 'Leclerc' } })
    fireEvent.change(screen.getByLabelText('Correo electrónico'), {
      target: { value: 'charles@ferrari.com' },
    })
    fireEvent.change(screen.getByLabelText('Contraseña inicial'), {
      target: { value: 'Password123!' },
    })
    fireEvent.change(screen.getByLabelText('Escudería'), { target: { value: teams[0]?.id } })
    fireEvent.change(screen.getByLabelText('Cargo en la escudería'), { target: { value: 'Jefe' } })
    fireEvent.change(screen.getByLabelText('Teléfono'), { target: { value: '+54 9 291 1234567' } })
    fireEvent.change(screen.getByLabelText('Legajo'), { target: { value: 'LEG-1234' } })

    const form = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }

    expect(onSubmit).toHaveBeenCalled()
  })

  it('muestra error si la creación falla con Error o texto no-Error', async () => {
    const onSubmit = vi
      .fn()
      .mockRejectedValueOnce(new Error('Email duplicado'))
      .mockRejectedValueOnce('fallo')
    render(<TeamStaffCreateForm teams={teams} onCancel={vi.fn()} onSubmit={onSubmit} />)

    const form = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }
    expect(await screen.findByText('Email duplicado')).toBeInTheDocument()

    if (form) {
      fireEvent.submit(form)
    }
    expect(await screen.findByText('Error al crear el personal')).toBeInTheDocument()
  })
})
