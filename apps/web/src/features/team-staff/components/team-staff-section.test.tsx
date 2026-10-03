import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { TeamStaffSection } from './team-staff-section'

describe('TeamStaffSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista los miembros devueltos por la API', async () => {
    mockFetchOnce(jsonResponse([aTeamStaffMember({ firstName: 'Carlos', lastName: 'Sainz' })]))
    renderWithQuery(<TeamStaffSection />)
    expect(await screen.findByText('Carlos Sainz')).toBeInTheDocument()
    expect(screen.getByText('Personal de escuderías')).toBeInTheDocument()
    expect(screen.getByText('Integrantes activos:').nextElementSibling).toHaveTextContent('1')
  })

  it('muestra estado vacío cuando no hay miembros', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TeamStaffSection />)
    expect(
      await screen.findByText('Todavía no hay personal de escuderías cargado.'),
    ).toBeInTheDocument()
  })

  it('muestra mensaje de error si la API falla', async () => {
    mockFetchOnce(new TypeError('Failed to fetch'))
    renderWithQuery(<TeamStaffSection />)
    expect(await screen.findByText(/No pudimos conectarnos/)).toBeInTheDocument()
  })

  it('abre el diálogo de nuevo integrante al hacer click en el botón', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<TeamStaffSection />)
    const newBtn = await screen.findByRole('button', { name: 'Nuevo integrante' })
    fireEvent.click(newBtn)
    expect(screen.getByText('Completá los datos para dar de alta la cuenta.')).toBeInTheDocument()
  })

  it('abre diálogo de edición al hacer click en Editar', async () => {
    mockFetchOnce(jsonResponse([aTeamStaffMember({ firstName: 'Charles', lastName: 'Leclerc' })]))
    renderWithQuery(<TeamStaffSection />)
    const editBtn = await screen.findByRole('button', { name: 'Editar' })
    fireEvent.click(editBtn)
    expect(screen.getByText('Editar integrante')).toBeInTheDocument()
  })

  it('abre diálogo de baja al hacer click en Dar de baja', async () => {
    mockFetchOnce(jsonResponse([aTeamStaffMember({ firstName: 'Charles', lastName: 'Leclerc' })]))
    renderWithQuery(<TeamStaffSection />)
    const deactBtn = await screen.findByRole('button', { name: 'Dar de baja' })
    fireEvent.click(deactBtn)
    expect(screen.getByText('Dar de baja cuenta de personal')).toBeInTheDocument()
  })
})
