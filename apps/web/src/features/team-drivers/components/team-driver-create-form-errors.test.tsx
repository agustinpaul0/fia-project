import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { TeamDriverCreateForm } from './team-driver-create-form'

describe('TeamDriverCreateForm validaciones', () => {
  it('marca cada campo obligatorio y no envía el alta', async () => {
    const onSubmit = vi.fn()
    render(<TeamDriverCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)
    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))

    expect(
      await screen.findByText('El nombre debe tener al menos 2 caracteres.'),
    ).toBeInTheDocument()
    expect(screen.getByText('El apellido debe tener al menos 2 caracteres.')).toBeInTheDocument()
    expect(
      screen.getByText('El código debe contener exactamente 3 letras mayúsculas.'),
    ).toBeInTheDocument()
    expect(screen.getByText('El país debe tener al menos 2 caracteres.')).toBeInTheDocument()
    expect(
      screen.getByText('La licencia deportiva debe tener al menos 3 caracteres.'),
    ).toBeInTheDocument()
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('ofrece titular y suplente como condición', () => {
    render(<TeamDriverCreateForm onCancel={vi.fn()} onSubmit={vi.fn()} />)
    const options = screen.getAllByRole('option').map((o) => o.textContent)
    expect(options).toEqual(['Titular', 'Suplente'])
    expect(screen.getByLabelText('Condición')).toHaveValue('main')
  })

  it('muestra un mensaje genérico si el error no trae descripción', async () => {
    const onSubmit = vi.fn().mockRejectedValue('fallo')
    render(<TeamDriverCreateForm onCancel={vi.fn()} onSubmit={onSubmit} />)
    const values: Record<string, string> = {
      Nombre: 'Franco',
      Apellido: 'Colapinto',
      'Código (3 letras)': 'COL',
      'Dorsal (1-99)': '43',
      'Nacionalidad / País': 'Argentina',
      'Licencia deportiva': 'FIA-43-COL',
    }
    for (const [label, value] of Object.entries(values)) {
      fireEvent.change(screen.getByLabelText(label), { target: { value } })
    }
    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))
    expect(await screen.findByText('Error al inscribir el piloto')).toBeInTheDocument()
  })
})
