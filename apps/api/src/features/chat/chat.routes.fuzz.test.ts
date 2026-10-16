import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { CHAT_ADMIN, CHAT_CONTACTS } from '../../testing/chat-builders'
import { sendJson } from '../../testing/http'
import { createTestApp } from '../../testing/test-app'

const { app } = createTestApp({ sessionUser: CHAT_ADMIN, chatContacts: CHAT_CONTACTS })

const expectTypedError = async (response: Response): Promise<void> => {
  expect(response.status).toBeLessThan(500)
  if (response.status >= 400) {
    expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
  }
}

describe('Fuzz de /chat', () => {
  it.each(['/chat/keys', '/chat/conversations'])(
    'POST %s con payloads arbitrarios nunca responde 5xx',
    async (path) => {
      await fc.assert(
        fc.asyncProperty(fc.anything(), async (body) => {
          await expectTypedError(await sendJson(app, { method: 'POST', path, body }))
        }),
      )
    },
  )

  it('mensajes en conversaciones arbitrarias nunca responden 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.string(), fc.anything(), async (id, body) => {
        const path = `/chat/conversations/${encodeURIComponent(id)}/messages`
        await expectTypedError(await sendJson(app, { method: 'POST', path, body }))
      }),
    )
  })
})
