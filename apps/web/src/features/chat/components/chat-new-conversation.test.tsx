import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { CONVERSATION } from '@/testing/fake-chat-server'
import { jsonResponse } from '@/testing/mock-fetch'
import { mockFetchRoutes } from '@/testing/mock-fetch-routes'
import { renderWithQuery } from '@/testing/render-with-query'
import { ChatNewConversation } from './chat-new-conversation'

const CONTACTS = [
  { id: 'bob', name: 'Bob Staff', role: 'team_staff', teamName: 'Ferrari' },
  { id: 'root', name: 'Admin FIA', role: 'fia_admin', teamName: null },
]

describe('ChatNewConversation', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('ofrece los contactos y abre la conversación elegida', async () => {
    const calls = mockFetchRoutes({
      'GET /chat/contacts': () => jsonResponse(CONTACTS),
      'POST /chat/conversations': () => jsonResponse(CONVERSATION, 201),
    })
    const onCreated = vi.fn()
    renderWithQuery(<ChatNewConversation onCreated={onCreated} />)
    expect(
      await screen.findByRole('option', { name: 'Admin FIA — Administración FIA' }),
    ).toBeInTheDocument()
    const button = screen.getByRole('button', { name: 'Iniciar chat cifrado' })
    expect(button).toBeDisabled()
    fireEvent.change(screen.getByLabelText('Nueva conversación'), { target: { value: 'bob' } })
    fireEvent.click(button)
    await waitFor(() => expect(onCreated).toHaveBeenCalledWith(CONVERSATION.id))
    expect(calls.find((c) => c.key === 'POST /chat/conversations')?.body).toEqual({
      recipientId: 'bob',
    })
    expect(screen.getByLabelText('Nueva conversación')).toHaveValue('')
  })

  it('muestra por qué no se pudo abrir la conversación', async () => {
    mockFetchRoutes({
      'GET /chat/contacts': () => jsonResponse(CONTACTS),
      'POST /chat/conversations': () =>
        jsonResponse({ error: { code: 'CHAT_KEY_NOT_FOUND', message: 'x', fields: null } }, 404),
    })
    renderWithQuery(<ChatNewConversation onCreated={vi.fn()} />)
    await screen.findByRole('option', { name: /Bob Staff/ })
    fireEvent.change(screen.getByLabelText('Nueva conversación'), { target: { value: 'bob' } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar chat cifrado' }))
    expect(await screen.findByRole('alert')).toHaveTextContent(/aún no ha registrado sus claves/)
  })
})
