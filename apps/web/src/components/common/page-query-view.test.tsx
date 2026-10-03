import { AppError } from '@fia/shared/domain'
import { useQuery } from '@tanstack/react-query'
import { fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithQuery } from '@/testing/render-with-query'
import { PageQueryView } from './page-query-view'

const Probe = ({ load }: { readonly load: () => Promise<string> }): ReactNode => (
  <PageQueryView query={useQuery({ queryKey: ['page-probe'], queryFn: load })}>
    {(text) => <p>{text}</p>}
  </PageQueryView>
)

describe('PageQueryView', () => {
  it('muestra la carga dentro del marco de la página', () => {
    renderWithQuery(<Probe load={() => new Promise(() => null)} />)
    expect(screen.getByRole('status', { name: 'Cargando' }).parentElement).toHaveClass('max-w-7xl')
  })

  it('muestra el error con reintento', async () => {
    renderWithQuery(<Probe load={() => Promise.reject(new AppError('FORBIDDEN'))} />)
    expect(await screen.findByText(/No tenés permisos/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText(/No tenés permisos/)).toBeInTheDocument()
  })

  it('renderiza los datos', async () => {
    renderWithQuery(<Probe load={() => Promise.resolve('listo')} />)
    expect(await screen.findByText('listo')).toBeInTheDocument()
  })
})
