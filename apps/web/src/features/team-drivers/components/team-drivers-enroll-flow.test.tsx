import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aDriver } from '@/testing/driver-builders'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { TeamDriversSection } from './team-drivers-section'

const toastSuccess = vi.fn()
vi.mock('sonner', () => ({ toast: { success: (msg: string) => toastSuccess(msg) } }))

const NEW_DRIVER = aDriver({ firstName: 'Franco', lastName: 'Colapinto', code: 'COL', number: 43 })

const fillForm = (): void => {
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
}

describe('Inscripción de un piloto desde la sección', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('envía el alta, refresca la nómina, cierra el diálogo y avisa', async () => {
    let enrolled = false
    const calls = mockFetchRoutes({
      'GET /team-drivers': () => jsonResponse(enrolled ? [NEW_DRIVER] : []),
      'POST /team-drivers': () => {
        enrolled = true
        return jsonResponse(NEW_DRIVER, 201)
      },
    })
    renderWithQuery(<TeamDriversSection />)
    fireEvent.click(await screen.findByRole('button', { name: '+ Inscribir piloto' }))
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))

    expect(await screen.findByText('Franco Colapinto')).toBeInTheDocument()
    expect(calls.find((c) => c.key === 'POST /team-drivers')?.body).toEqual({
      firstName: 'Franco',
      lastName: 'Colapinto',
      code: 'COL',
      number: 43,
      country: 'Argentina',
      license: 'FIA-43-COL',
      role: 'main',
    })
    expect(toastSuccess).toHaveBeenCalledWith('Piloto inscripto exitosamente.')
    await waitFor(() =>
      expect(screen.queryByText('Inscribir nuevo piloto')).not.toBeInTheDocument(),
    )
  })

  it('muestra el error del servidor y deja el diálogo abierto', async () => {
    mockFetchRoutes({
      'GET /team-drivers': () => jsonResponse([]),
      'POST /team-drivers': () =>
        jsonResponse(
          {
            error: {
              code: 'CAR_NUMBER_ALREADY_TAKEN',
              message: 'El número de auto ya está asignado a otro piloto de la categoría.',
              fields: null,
            },
          },
          409,
        ),
    })
    renderWithQuery(<TeamDriversSection />)
    fireEvent.click(await screen.findByRole('button', { name: '+ Inscribir piloto' }))
    fillForm()
    fireEvent.click(screen.getByRole('button', { name: 'Inscribir piloto' }))

    expect(
      await screen.findByText('El número de auto ya está asignado a otro piloto de la categoría.'),
    ).toBeInTheDocument()
    expect(screen.getByText('Inscribir nuevo piloto')).toBeInTheDocument()
  })
})
