import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithRouter } from '@/testing/render-with-router'
import { MainNav } from './main-nav'

const linkNames = (): string[] => screen.getAllByRole('link').map((link) => link.textContent ?? '')

describe('MainNav', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ofrece a todos el acceso a inicio y a resultados', async () => {
    renderWithRouter(<MainNav userRole={null} />)
    expect(await screen.findByRole('link', { name: 'Resultados' })).toHaveAttribute(
      'href',
      '/results',
    )
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
    expect(linkNames()).toEqual(['Inicio', 'Resultados'])
  })

  it('suma las secciones administrativas para fia_admin', async () => {
    renderWithRouter(<MainNav userRole="fia_admin" />)
    expect(await screen.findByRole('link', { name: 'Personal' })).toHaveAttribute(
      'href',
      '/admin/team-staff',
    )
    expect(screen.getByRole('link', { name: 'Carga de resultados' })).toHaveAttribute(
      'href',
      '/admin/results',
    )
    expect(screen.getByRole('link', { name: 'Confirmaciones' })).toHaveAttribute(
      'href',
      '/admin/notifications',
    )
  })

  it('suma la bandeja de notificaciones para team_staff', async () => {
    mockFetchRoutes({ 'GET /notifications': () => jsonResponse([]) })
    renderWithRouter(<MainNav userRole="team_staff" />)
    expect(await screen.findByRole('link', { name: 'Notificaciones' })).toHaveAttribute(
      'href',
      '/notifications',
    )
    expect(screen.queryByRole('link', { name: 'Personal' })).not.toBeInTheDocument()
  })

  it('marca como activa la sección actual', async () => {
    renderWithRouter(<MainNav userRole={null} />)
    expect(await screen.findByRole('link', { name: 'Inicio' })).toHaveClass('nav-pill')
    expect(screen.getByRole('link', { name: 'Resultados' })).not.toHaveClass('nav-pill')
  })
})
