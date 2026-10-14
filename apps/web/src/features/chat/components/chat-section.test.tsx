import type { ChatConversation } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { jsonResponse, mockFetchOnce } from '@/testing/mock-fetch'
import { renderWithQuery } from '@/testing/render-with-query'
import { ChatSection } from './chat-section'

vi.mock('@/lib/auth-client', () => ({
  useSession: vi.fn(() => ({ data: { user: { id: 'user-1', role: 'fia_admin' } } })),
}))

vi.mock('../crypto/key-manager', () => ({
  ensureMyKeys: vi.fn().mockResolvedValue({}),
}))

const mockConv: ChatConversation = {
  id: '00000000-0000-4000-8000-000000000001',
  otherUserId: 'user-2',
  otherUserName: 'Lewis Hamilton',
  otherUserRole: 'team_staff',
  otherTeamName: 'Ferrari',
  createdAt: '2026-10-14T12:00:00.000Z',
}

describe('ChatSection', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('muestra estado inicial con lista de conversaciones y placeholder de selección', async () => {
    mockFetchOnce(jsonResponse([mockConv]))
    renderWithQuery(<ChatSection />)

    expect(await screen.findByText('Lewis Hamilton')).toBeInTheDocument()
    expect(screen.getByText('Ferrari')).toBeInTheDocument()
    expect(screen.getByText('Seleccioná una conversación')).toBeInTheDocument()
  })

  it('selecciona una conversación al hacer click en el contacto', async () => {
    mockFetchOnce(jsonResponse([mockConv]))
    renderWithQuery(<ChatSection />)

    const item = await screen.findByText('Lewis Hamilton')
    fireEvent.click(item)

    expect(await screen.findByText(/Cifrado E2E Activo/)).toBeInTheDocument()
    expect(
      screen.getByPlaceholderText(/Escribí un mensaje cifrado de extremo a extremo/),
    ).toBeInTheDocument()
  })
})
