import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { fillCommon, MONACO, renderForm } from '@/testing/penalty-form'

describe('PenaltyCreateForm: fecha y carrera', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('registra la fecha y la carrera de la categoría de la escudería', async () => {
    const { onSubmit } = renderForm()
    await screen.findByRole('option', { name: 'Ferrari' })
    await fillCommon()
    fireEvent.change(screen.getByLabelText('Fecha de la sanción'), {
      target: { value: '2026-05-24T12:30' },
    })
    await screen.findByRole('option', { name: /GP de Mónaco/ })
    fireEvent.change(screen.getByLabelText('Carrera'), { target: { value: MONACO } })
    fireEvent.click(screen.getByRole('button', { name: 'Registrar sanción' }))
    await waitFor(() =>
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({ raceId: MONACO, issuedAt: '2026-05-24T15:30:00.000Z' }),
      ),
    )
  })
})
