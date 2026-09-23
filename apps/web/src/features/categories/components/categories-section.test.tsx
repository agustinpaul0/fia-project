import { screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { aCategory } from '@/testing/category-builders'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { CategoriesSection } from './categories-section'

describe('CategoriesSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('lista las categorías devueltas por la API', async () => {
    mockFetchOnce(jsonResponse([aCategory(), aCategory({ id: crypto.randomUUID(), code: 'F2' })]))
    renderWithQuery(<CategoriesSection />)
    expect(await screen.findAllByText('Fórmula 1')).toHaveLength(2)
    expect(screen.getByText('F2')).toBeInTheDocument()
  })

  it('muestra el estado vacío', async () => {
    mockFetchOnce(jsonResponse([]))
    renderWithQuery(<CategoriesSection />)
    expect(await screen.findByText('Todavía no hay categorías cargadas.')).toBeInTheDocument()
  })

  it('muestra un mensaje claro si no hay conexión', async () => {
    mockFetchOnce(new TypeError('Failed to fetch'))
    renderWithQuery(<CategoriesSection />)
    expect(await screen.findByText(/No pudimos conectarnos/)).toBeInTheDocument()
  })
})
