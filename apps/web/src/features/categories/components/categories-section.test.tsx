import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aCategory } from '@/testing/category-builders'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithRouter } from '@/testing/render-with-router'
import { CategoriesSection } from './categories-section'

describe('CategoriesSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista las categorías devueltas por la API', async () => {
    mockFetchOnce(jsonResponse([aCategory(), aCategory({ id: crypto.randomUUID(), code: 'F2' })]))
    renderWithRouter(<CategoriesSection />)
    expect(await screen.findAllByText('Fórmula 1')).toHaveLength(2)
    expect(screen.getByText('F2')).toBeInTheDocument()
    expect(screen.getAllByRole('link', { name: 'Ver resultados de Fórmula 1' })[1]).toHaveAttribute(
      'href',
      '/results?category=F2',
    )
  })

  it('muestra la cantidad de categorías y la temporada en curso', async () => {
    mockFetchOnce(jsonResponse([aCategory()]))
    renderWithRouter(<CategoriesSection now={new Date('2026-10-03T12:00:00.000Z')} />)
    expect(await screen.findByText('1 activas')).toBeInTheDocument()
    expect(
      screen.getByText('Temporada 2026 en curso — Resultados oficiales FIA disponibles'),
    ).toBeInTheDocument()
  })

  it('muestra el estado vacío', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithRouter(<CategoriesSection />)
    expect(await screen.findByText('Todavía no hay categorías cargadas.')).toBeInTheDocument()
  })

  it('muestra un mensaje claro si no hay conexión', async () => {
    mockFetchOnce(new TypeError('Failed to fetch'))
    renderWithRouter(<CategoriesSection />)
    expect(await screen.findByText(/No pudimos conectarnos/)).toBeInTheDocument()
  })
})
