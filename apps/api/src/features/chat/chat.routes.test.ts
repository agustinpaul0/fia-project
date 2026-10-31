import { describe, expect, it } from 'vitest'
import type { SessionUser } from '../../core/auth/session'
import {
  CHAT_ADMIN,
  CHAT_CONTACTS,
  CHAT_OUTSIDER,
  CHAT_STAFF,
  ENCRYPTED_BODY,
  PUBLIC_KEYS,
} from '../../testing/chat-builders'
import { sendJson } from '../../testing/http'
import { createTestApp } from '../../testing/test-app'

const setup = () => {
  const ctx = createTestApp({ sessionUser: CHAT_ADMIN, chatContacts: CHAT_CONTACTS })
  const { app: _app, ...sharedRepositories } = ctx
  const as = (user: SessionUser) => createTestApp({ sessionUser: user, sharedRepositories }).app
  return { app: ctx.app, chat: ctx.chat, as }
}

describe('rutas de chat E2E', () => {
  it('exige sesión y rol de FIA o escudería', async () => {
    expect((await createTestApp({ sessionUser: null }).app.request('/chat/contacts')).status).toBe(
      401,
    )
    const publicUser: SessionUser = { id: 'p', role: 'public', teamId: null }
    const { app } = createTestApp({ sessionUser: publicUser })
    expect((await app.request('/chat/conversations')).status).toBe(403)
  })

  it('un piloto con cuenta oficial puede usar el chat (US-27)', async () => {
    const driver: SessionUser = { id: 'drv-1', role: 'driver', teamId: null }
    const { app } = createTestApp({ sessionUser: driver, chatContacts: CHAT_CONTACTS })
    expect((await app.request('/chat/contacts')).status).toBe(200)
  })

  it('lista los contactos posibles sin incluirse a uno mismo', async () => {
    const { app } = setup()
    const body = (await (await app.request('/chat/contacts')).json()) as Array<{ id: string }>
    expect(body.map((c) => c.id)).toEqual(['staff-1', 'staff-2'])
  })

  it('registra y devuelve las claves públicas', async () => {
    const { app } = setup()
    expect(
      (await sendJson(app, { method: 'POST', path: '/chat/keys', body: PUBLIC_KEYS })).status,
    ).toBe(200)
    const res = await app.request('/chat/keys/admin-1')
    expect(await res.json()).toMatchObject({ userId: 'admin-1', ...PUBLIC_KEYS })
    expect((await app.request('/chat/keys/nadie')).status).toBe(404)
  })

  it('no abre conversación con quien no activó el cifrado ni con usuarios fuera del chat', async () => {
    const { app } = setup()
    const open = (recipientId: string) =>
      sendJson(app, { method: 'POST', path: '/chat/conversations', body: { recipientId } })
    expect(((await (await open('staff-1')).json()) as { error: { code: string } }).error.code).toBe(
      'CHAT_KEY_NOT_FOUND',
    )
    expect((await open('desconocido')).status).toBe(400)
    expect((await open('admin-1')).status).toBe(400)
  })

  it('sólo los participantes leen y escriben en la conversación', async () => {
    const { as, chat } = setup()
    chat.keys.set('staff-1', PUBLIC_KEYS)
    const conv = (await (
      await sendJson(as(CHAT_ADMIN), {
        method: 'POST',
        path: '/chat/conversations',
        body: { recipientId: 'staff-1' },
      })
    ).json()) as { id: string; otherUserId: string }
    expect(conv.otherUserId).toBe('staff-1')
    const path = `/chat/conversations/${conv.id}/messages`
    expect(
      (await sendJson(as(CHAT_STAFF), { method: 'POST', path, body: ENCRYPTED_BODY })).status,
    ).toBe(201)
    const read = (await (await as(CHAT_ADMIN).request(path)).json()) as Array<{
      recipientId: string
    }>
    expect(read).toEqual([expect.objectContaining({ ...ENCRYPTED_BODY, recipientId: 'admin-1' })])
    expect((await as(CHAT_OUTSIDER).request(path)).status).toBe(404)
    expect(
      (await sendJson(as(CHAT_OUTSIDER), { method: 'POST', path, body: ENCRYPTED_BODY })).status,
    ).toBe(404)
  })

  it('valida el id de la conversación', async () => {
    const { app } = setup()
    expect((await app.request('/chat/conversations/invalido/messages')).status).toBe(400)
  })
})
