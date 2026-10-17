import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PEER, startFakeChatServer } from '@/testing/fake-chat-server'
import { renderWithQuery } from '@/testing/render-with-query'
import { generateE2EKeyPairs } from '../crypto/e2e-crypto'
import { OFFLINE_NOTICE } from '../hooks/use-chat-thread'
import { PENDING_LABEL } from './chat-message-bubble'
import { ChatSection } from './chat-section'

vi.mock('../crypto/key-storage', async (importOriginal) => {
  const real = await importOriginal<typeof import('../crypto/key-storage')>()
  return { ...real, indexedDbKeyStorage: real.createMemoryKeyStorage() }
})
vi.mock('../crypto/outbox-storage', async (importOriginal) => {
  const real = await importOriginal<typeof import('../crypto/outbox-storage')>()
  return { ...real, indexedDbOutbox: real.createMemoryOutbox() }
})
vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: { user: { id: 'alice', role: 'fia_admin' } } }),
}))
const toastInfo = vi.fn()
vi.mock('sonner', () => ({ toast: { info: (m: string) => toastInfo(m), error: vi.fn() } }))

describe('Chat sin conexión', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('encola el mensaje cifrado y lo envía cuando vuelve la conexión', async () => {
    const server = await startFakeChatServer(await generateE2EKeyPairs())
    renderWithQuery(<ChatSection />)
    await screen.findByRole('option', { name: /Bob Staff/ })
    fireEvent.change(screen.getByLabelText('Nueva conversación'), { target: { value: PEER.id } })
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar chat cifrado' }))
    const input = await screen.findByPlaceholderText(/Escribí un mensaje/)
    await waitFor(() => expect(input).toBeEnabled())
    server.setOffline(true)
    fireEvent.change(input, { target: { value: 'Mensaje sin red' } })
    fireEvent.click(screen.getByRole('button', { name: /Enviar/ }))
    expect(await screen.findByText(PENDING_LABEL)).toBeInTheDocument()
    expect(screen.getByText('Mensaje sin red')).toBeInTheDocument()
    expect(toastInfo).toHaveBeenCalledWith(OFFLINE_NOTICE)
    await waitFor(() => expect(input).toHaveValue(''))
    server.setOffline(false)
    window.dispatchEvent(new Event('online'))
    expect(await screen.findByText('Cifrado E2E y firma verificada')).toBeInTheDocument()
    expect(screen.queryByText(PENDING_LABEL)).not.toBeInTheDocument()
    const posted = server.calls.filter(
      (c) => c.key.startsWith('POST') && c.key.endsWith('/messages'),
    )
    expect(JSON.stringify(posted.at(-1)?.body)).not.toContain('Mensaje sin red')
  })
})
