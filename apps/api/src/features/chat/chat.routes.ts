import {
  chatConversationListSchema,
  chatConversationSchema,
  chatMessageListSchema,
  chatMessageSchema,
  createConversationBodySchema,
  createEncryptedMessageBodySchema,
  registerPublicKeysBodySchema,
  userPublicKeysSchema,
} from '@fia/shared/contracts'
import { Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { ChatService } from './chat.service'

const authRoles = requireRole('fia_admin', 'team_staff')

const createKeysRouter = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .post('/', authRoles, validate('json', registerPublicKeysBodySchema), async (c) => {
      const user = c.get('sessionUser')
      if (!user) {
        return c.json({ error: 'UNAUTHORIZED' }, 401)
      }
      await service.registerKeys(user.id, c.req.valid('json'))
      return ok(c, registerPublicKeysBodySchema, c.req.valid('json'))
    })
    .get('/:userId', authRoles, async (c) => {
      const keys = await service.getUserKeys(c.req.param('userId'))
      return ok(c, userPublicKeysSchema, keys)
    })

const createConversationsRouter = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', authRoles, async (c) => {
      const user = c.get('sessionUser')
      if (!user) {
        return c.json({ error: 'UNAUTHORIZED' }, 401)
      }
      const list = await service.listConversations(user.id)
      return ok(c, chatConversationListSchema, list)
    })
    .post('/', authRoles, validate('json', createConversationBodySchema), async (c) => {
      const user = c.get('sessionUser')
      if (!user) {
        return c.json({ error: 'UNAUTHORIZED' }, 401)
      }
      const conv = await service.getOrCreateConversation(user.id, c.req.valid('json').recipientId)
      return created(c, chatConversationSchema, conv)
    })
    .get('/:id/messages', authRoles, async (c) => {
      const user = c.get('sessionUser')
      if (!user) {
        return c.json({ error: 'UNAUTHORIZED' }, 401)
      }
      const list = await service.listMessages(c.req.param('id'), user.id)
      return ok(c, chatMessageListSchema, list)
    })
    .post(
      '/:id/messages',
      authRoles,
      validate('json', createEncryptedMessageBodySchema),
      async (c) => {
        const user = c.get('sessionUser')
        if (!user) {
          return c.json({ error: 'UNAUTHORIZED' }, 401)
        }
        const msg = await service.sendMessage({
          conversationId: c.req.param('id'),
          senderId: user.id,
          body: c.req.valid('json'),
        })
        return created(c, chatMessageSchema, msg)
      },
    )

export const createChatRoutes = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .route('/keys', createKeysRouter(service))
    .route('/conversations', createConversationsRouter(service))
