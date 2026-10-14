import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamDriverCreateForm } from './team-driver-create-form'

describe('TeamDriverCreateForm', () => {
  it('envía los datos del formulario al completar todos los campos válidos', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined)
    const onCancel = vi.fn()
    render(<TeamDriverCreateForm onCancel={onCancel} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Franco' } })
    fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Colapinto' } })
    fireEvent.change(screen.getByLabelText(/Código/), { target: { value: 'COL' } })
    fireEvent.change(screen.getByLabelText(/Dorsal/), { target: { value: '43' } })
    fireEvent.change(screen.getByLabelText(/País/), { target: { value: 'Argentina' } })

    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith({
        firstName: 'Franco',
        lastName: 'Colapinto',
        code: 'COL',
        number: 43,
        country: 'Argentina',
        role: 'main',
      })
    })
  })

  it('muestra el mensaje de error cuando onSubmit falla', async () => {
    const onSubmit = vi.fn().mockRejectedValue(new Error('Número de auto ya en uso'))
    render(<TeamDriverCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)

    fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Franco' } })
    fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Colapinto' } })
    fireEvent.change(screen.getByLabelText(/Código/), { target: { value: 'COL' } })
    fireEvent.change(screen.getByLabelText(/Dorsal/), { target: { value: '43' } })
    fireEvent.change(screen.getByLabelText(/País/), { target: { value: 'Argentina' } })

    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))

    expect(await screen.findByText('Número de auto ya en uso')).toBeInTheDocument()
  })

  it('llama a onCancel cuando se pulsa el botón Cancelar', () => {
    const onCancel = vi.fn()
    render(<TeamDriverCreateForm onCancel={onCancel} onSubmit={vi.fn()} />)

    fireEvent.click(screen.getByRole('button', { name: 'Cancelar' }))
    expect(onCancel).toHaveBeenCalled()
  })
})
