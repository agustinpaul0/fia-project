import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import { createTestApp } from '../../testing/test-app'

const STAFF_USER: SessionUser = {
  id: 'user-1',
  role: 'team_staff',
  teamId: '00000000-0000-4000-8000-000000000001',
}

const ADMIN_USER: SessionUser = {
  id: 'admin-1',
  role: 'fia_admin',
  teamId: null,
}

describe('rutas de chat E2E', () => {
  it('exige autenticación', async () => {
    const { app } = createTestApp({ sessionUser: null })
    const res = await app.request('/chat/conversations')
    expect(res.status).toBe(401)
  })

  it('permite registrar claves públicas a un usuario autenticado', async () => {
    const { app } = createTestApp({ sessionUser: STAFF_USER })
    const res = await app.request('/chat/keys', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        ecdhPublicKey: '{"kty":"EC","crv":"P-256","x":"123","y":"456"}',
        ecdsaPublicKey: '{"kty":"EC","crv":"P-256","x":"789","y":"012"}',
      }),
    })
    expect(res.status).toBe(200)

    const resGet = await app.request('/chat/keys/user-1')
    expect(resGet.status).toBe(200)
    const body = (await resGet.json()) as { userId: string }
    expect(body.userId).toBe('user-1')
  })

  it('permite crear conversación y listar conversaciones', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER })
    const resCreate = await app.request('/chat/conversations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    expect(resCreate.status).toBe(201)
    const conv = (await resCreate.json()) as { id: string; otherUserId: string }
    expect(conv.otherUserId).toBe('user-2')

    const resList = await app.request('/chat/conversations')
    expect(resList.status).toBe(200)
    const list = (await resList.json()) as unknown[]
    expect(list.length).toBeGreaterThanOrEqual(1)
  })

  it('permite enviar y listar mensajes cifrados en una conversación', async () => {
    const { app } = createTestApp({ sessionUser: ADMIN_USER })
    const resCreateConv = await app.request('/chat/conversations', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ recipientId: 'user-2' }),
    })
    const conv = (await resCreateConv.json()) as { id: string }

    const resSend = await app.request(`/chat/conversations/${conv.id}/messages`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        encryptedContent: 'aW5pdGlhbFBheWxvYWQ=',
        iv: 'MTIzNDU2Nzg5MDEy',
        signature: 'c2lnbmF0dXJlRXhhbXBsZVN0cmluZw==',
      }),
    })
    expect(resSend.status).toBe(201)
    const msg = (await resSend.json()) as { encryptedContent: string }
    expect(msg.encryptedContent).toBe('aW5pdGlhbFBheWxvYWQ=')

    const resList = await app.request(`/chat/conversations/${conv.id}/messages`)
    expect(resList.status).toBe(200)
    const msgs = (await resList.json()) as unknown[]
    expect(msgs.length).toBeGreaterThanOrEqual(1)
  })
})
