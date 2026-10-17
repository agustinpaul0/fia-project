import type { ChatConversation } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CONVERSATION } from '@/testing/fake-chat-server'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { ChatSection, MY_KEYS_ERROR } from './chat-section'

vi.mock('../crypto/outbox-storage', async (importOriginal) => {
  const real = await importOriginal<typeof import('../crypto/outbox-storage')>()
  return { ...real, indexedDbOutbox: real.createMemoryOutbox() }
})
vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: { user: { id: 'alice', role: 'fia_admin' } } }),
}))
const ensureMyKeys = vi.hoisted(() => vi.fn())
vi.mock('../crypto/key-manager', () => ({ ensureMyKeys }))

const routes = (conversations: readonly ChatConversation[]) => ({
  'GET /chat/conversations': () => jsonResponse(conversations),
  'GET /chat/contacts': () => jsonResponse([]),
})

describe('ChatSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    ensureMyKeys.mockReset()
  })

  it('invita a elegir una conversación cuando no hay ninguna seleccionada', async () => {
    ensureMyKeys.mockResolvedValue({})
    mockFetchRoutes(routes([]))
    renderWithQuery(<ChatSection />)
    expect(await screen.findByText('No tenés conversaciones iniciadas.')).toBeInTheDocument()
    expect(screen.getByText('Seleccioná una conversación')).toBeInTheDocument()
    expect(screen.getByText('Conversaciones Activas (0)')).toBeInTheDocument()
    expect(ensureMyKeys).toHaveBeenCalledWith('alice')
  })

  it('muestra la conversación elegida con su escudería', async () => {
    ensureMyKeys.mockResolvedValue({})
    mockFetchRoutes(routes([CONVERSATION]))
    renderWithQuery(<ChatSection />)
    fireEvent.click(await screen.findByRole('button', { name: /Bob Staff/ }))
    expect(await screen.findByRole('heading', { name: 'Bob Staff' })).toBeInTheDocument()
    expect(screen.getAllByText('Ferrari').length).toBeGreaterThanOrEqual(1)
  })

  it('avisa si no se pudieron preparar las claves propias', async () => {
    ensureMyKeys.mockRejectedValue(new Error('sin indexedDB'))
    mockFetchRoutes(routes([CONVERSATION]))
    renderWithQuery(<ChatSection />)
    fireEvent.click(await screen.findByRole('button', { name: /Bob Staff/ }))
    expect(await screen.findByText(MY_KEYS_ERROR)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Escribí un mensaje/)).toBeDisabled()
  })
})
