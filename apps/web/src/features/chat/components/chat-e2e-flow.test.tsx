import { fireEvent, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { PEER, startFakeChatServer } from '@/testing/fake-chat-server'
import { renderWithQuery } from '@/testing/render-with-query'
import { createConversationCipher } from '../crypto/conversation-cipher'
import { generateE2EKeyPairs } from '../crypto/e2e-crypto'
import { UNVERIFIED_MESSAGE } from './chat-message-bubble'
import { ChatSection } from './chat-section'

vi.mock('@/lib/auth-client', () => ({
  useSession: () => ({ data: { user: { id: 'alice', role: 'fia_admin' } } }),
}))
vi.mock('../crypto/key-storage', async (importOriginal) => {
  const real = await importOriginal<typeof import('../crypto/key-storage')>()
  return { ...real, indexedDbKeyStorage: real.createMemoryKeyStorage() }
})

const openChatWithPeer = async (): Promise<void> => {
  renderWithQuery(<ChatSection />)
  await screen.findByRole('option', { name: /Bob Staff/ })
  fireEvent.change(screen.getByLabelText('Nueva conversación'), { target: { value: PEER.id } })
  fireEvent.click(screen.getByRole('button', { name: 'Iniciar chat cifrado' }))
  await screen.findByRole('heading', { name: PEER.name })
}

const send = async (text: string): Promise<void> => {
  const input = await screen.findByPlaceholderText(/Escribí un mensaje/)
  await waitFor(() => expect(input).toBeEnabled())
  fireEvent.change(input, { target: { value: text } })
  fireEvent.click(screen.getByRole('button', { name: /Enviar/ }))
}

describe('Chat cifrado de extremo a extremo', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('cifra en el dispositivo: el servidor recibe sólo texto cifrado y firmado', async () => {
    const server = await startFakeChatServer(await generateE2EKeyPairs())
    await openChatWithPeer()
    await send('Telemetría confidencial del GP')
    expect(await screen.findByText('Telemetría confidencial del GP')).toBeInTheDocument()
    expect(screen.getByText('Cifrado E2E y firma verificada')).toBeInTheDocument()
    const posted = server.calls.find((c) => c.key.endsWith('/messages') && c.key.startsWith('POST'))
    expect(JSON.stringify(posted?.body)).not.toContain('Telemetría')
    expect(server.myPublicKeys()?.ecdhPublicKey).toContain('"kty":"EC"')
  })

  it('descifra lo que manda el otro y alerta si la firma no coincide', async () => {
    const peer = await generateE2EKeyPairs()
    const server = await startFakeChatServer(peer)
    await openChatWithPeer()
    const mine = server.myPublicKeys()
    if (mine === null) {
      throw new Error('Alice no registró sus claves')
    }
    const asPeer = await createConversationCipher(peer, {
      userId: 'alice',
      userName: 'Alice',
      userRole: 'fia_admin',
      teamName: null,
      ...mine,
    })
    server.deliver(PEER.id, await asPeer.encrypt('Recibido, gracias'))
    const forged = await asPeer.encrypt('Mensaje adulterado')
    server.deliver(PEER.id, { ...forged, signature: (await asPeer.encrypt('otro')).signature })
    await send('Hola')
    expect(await screen.findByText('Recibido, gracias')).toBeInTheDocument()
    expect(screen.queryByText('Mensaje adulterado')).not.toBeInTheDocument()
    expect(screen.getByText(UNVERIFIED_MESSAGE)).toBeInTheDocument()
  })

  it('no permite escribir si el destinatario no tiene claves', async () => {
    await startFakeChatServer(null)
    await openChatWithPeer()
    expect(await screen.findByText(/aún no ha registrado sus claves/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Escribí un mensaje/)).toBeDisabled()
  })
})
