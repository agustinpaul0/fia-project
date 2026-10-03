import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { aCreateBody, fillCreateForm } from '@/testing/team-staff-form'
import { TeamStaffSection } from './team-staff-section'

const mockApi = (members = [aTeamStaffMember()]) => {
  const fetchMock = vi.fn((input: RequestInfo | URL, init?: RequestInit) => {
    const url = String(input)
    const method = init?.method ?? 'GET'
    if (url.endsWith('/teams')) {
      return Promise.resolve(
        jsonResponse([{ id: '00000000-0000-4000-8000-000000000010', name: 'Ferrari' }]),
      )
    }
    if (method === 'POST') {
      return Promise.resolve(jsonResponse(members[0] ?? aTeamStaffMember(), 201))
    }
    if (method === 'PUT') {
      return Promise.resolve(jsonResponse(members[0] ?? aTeamStaffMember()))
    }
    if (method === 'DELETE') {
      return Promise.resolve(new Response(null, { status: 204 }))
    }
    return Promise.resolve(jsonResponse(members))
  })
  vi.stubGlobal('fetch', fetchMock)
}

describe('TeamStaffSection acciones de mutación', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ejecuta creación de integrante desde la sección', async () => {
    mockApi([])
    renderWithQuery(<TeamStaffSection />)
    const newBtn = await screen.findByRole('button', { name: 'Nuevo integrante' })
    fireEvent.click(newBtn)
    await screen.findByRole('option', { name: 'Ferrari' })
    fillCreateForm(aCreateBody('00000000-0000-4000-8000-000000000010'))

    const form = screen.getByRole('button', { name: 'Crear cuenta' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }
    await vi.waitFor(() =>
      expect(
        screen.queryByText('Completá los datos para dar de alta la cuenta.'),
      ).not.toBeInTheDocument(),
    )
  })

  it('ejecuta edición y baja de integrante desde la sección', async () => {
    mockApi()
    renderWithQuery(<TeamStaffSection />)
    const editBtn = await screen.findByRole('button', { name: 'Editar' })
    fireEvent.click(editBtn)

    const form = screen.getByRole('button', { name: 'Guardar cambios' }).closest('form')
    if (form) {
      fireEvent.submit(form)
    }
    await vi.waitFor(() => expect(screen.queryByText('Editar integrante')).not.toBeInTheDocument())

    const deactBtn = await screen.findByRole('button', { name: 'Dar de baja' })
    fireEvent.click(deactBtn)
    fireEvent.click(screen.getByRole('button', { name: 'Confirmar baja' }))
    await vi.waitFor(() =>
      expect(screen.queryByText('Dar de baja cuenta de personal')).not.toBeInTheDocument(),
    )
  })
})
