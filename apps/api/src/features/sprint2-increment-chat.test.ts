import { API_PATHS } from '@fia/shared/contracts'
import { describe, expect, it } from 'vitest'
import {
  CHAT_ADMIN,
  CHAT_OUTSIDER,
  CHAT_STAFF,
  ENCRYPTED_BODY,
  PUBLIC_KEYS,
} from '../testing/chat-builders'
import { sendJson } from '../testing/http'
import { sharedIncrementApp } from '../testing/sprint2-increment-app'

describe('Incremento de producto Sprint 2 (US-2): chat cifrado', () => {
  it('FIA y escudería conversan cifrado y un tercero no puede leer la conversación', async () => {
    const as = sharedIncrementApp()
    for (const user of [CHAT_ADMIN, CHAT_STAFF]) {
      await sendJson(as(user), {
        method: 'POST',
        path: `${API_PATHS.chat}/keys`,
        body: PUBLIC_KEYS,
      })
    }
    const convRes = await sendJson(as(CHAT_STAFF), {
      method: 'POST',
      path: `${API_PATHS.chat}/conversations`,
      body: { recipientId: CHAT_ADMIN.id },
    })
    const { id } = (await convRes.json()) as { id: string }
    const path = `${API_PATHS.chat}/conversations/${id}/messages`
    expect(
      (await sendJson(as(CHAT_STAFF), { method: 'POST', path, body: ENCRYPTED_BODY })).status,
    ).toBe(201)
    expect(await (await as(CHAT_ADMIN).request(path)).json()).toEqual([
      expect.objectContaining(ENCRYPTED_BODY),
    ])
    expect((await as(CHAT_OUTSIDER).request(path)).status).toBe(404)
    expect((await as(null).request(path)).status).toBe(401)
  })
})
