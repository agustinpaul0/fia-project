import { AppError } from '@fia/shared/domain'
import { useQuery } from '@tanstack/react-query'
import { fireEvent, screen } from '@testing-library/react'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { renderWithQuery } from '@/testing/render-with-query'
import { QueryView } from './query-view'

const Probe = ({ load }: { readonly load: () => Promise<readonly string[]> }): ReactNode => (
  <QueryView
    query={useQuery({ queryKey: ['probe'], queryFn: load })}
    isEmpty={(items) => items.length === 0}
    emptyMessage="Sin datos"
  >
    {(items) => <p>{items.join(',')}</p>}
  </QueryView>
)

describe('QueryView', () => {
  it('muestra el estado de carga', () => {
    renderWithQuery(<Probe load={() => new Promise(() => null)} />)
    expect(screen.getByRole('status', { name: 'Cargando' })).toBeInTheDocument()
  })

  it('muestra el mensaje de error y el botón de reintento', async () => {
    renderWithQuery(<Probe load={() => Promise.reject(new AppError('FORBIDDEN'))} />)
    expect(await screen.findByText(/No tenés permisos/)).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: 'Reintentar' }))
    expect(await screen.findByText(/No tenés permisos/)).toBeInTheDocument()
  })

  it('muestra el estado vacío', async () => {
    renderWithQuery(<Probe load={() => Promise.resolve([])} />)
    expect(await screen.findByText('Sin datos')).toBeInTheDocument()
  })

  it('renderiza los datos', async () => {
    renderWithQuery(<Probe load={() => Promise.resolve(['a', 'b'])} />)
    expect(await screen.findByText('a,b')).toBeInTheDocument()
  })
})
