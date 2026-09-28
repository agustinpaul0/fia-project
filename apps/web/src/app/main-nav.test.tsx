import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/testing/render-with-router'
import { MainNav } from './main-nav'

describe('MainNav', () => {
  it('ofrece a todos el acceso a inicio y a resultados', async () => {
    renderWithRouter(<MainNav />)
    expect(await screen.findByRole('link', { name: 'Resultados' })).toHaveAttribute(
      'href',
      '/results',
    )
    expect(screen.getByRole('link', { name: 'Inicio' })).toHaveAttribute('href', '/')
  })
})
