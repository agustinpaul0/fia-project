import {
  chatContactListSchema,
  chatConversationListSchema,
  chatConversationSchema,
  chatMessageListSchema,
  chatMessageSchema,
  chatUserParamsSchema,
  createConversationBodySchema,
  createEncryptedMessageBodySchema,
  idParamsSchema,
  registerPublicKeysBodySchema,
  userPublicKeysSchema,
} from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import { type Context, Hono } from 'hono'
import { requireRole } from '../../core/auth/access'
import type { AppEnv } from '../../core/auth/session'
import { created, ok } from '../../core/http/respond'
import { validate } from '../../core/http/validate'
import type { ChatService } from './chat.service'

const chatUsers = requireRole('fia_admin', 'team_staff')

const userIdOf = (c: Context<AppEnv>): string => {
  const user = c.get('sessionUser')
  if (user === null) {
    throw new AppError('UNAUTHENTICATED')
  }
  return user.id
}

const createKeysRouter = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .post('/', chatUsers, validate('json', registerPublicKeysBodySchema), async (c) => {
      await service.registerKeys(userIdOf(c), c.req.valid('json'))
      return ok(c, registerPublicKeysBodySchema, c.req.valid('json'))
    })
    .get('/:userId', chatUsers, validate('param', chatUserParamsSchema), async (c) =>
      ok(c, userPublicKeysSchema, await service.getUserKeys(c.req.valid('param').userId)),
    )

const createConversationsRouter = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/', chatUsers, async (c) =>
      ok(c, chatConversationListSchema, await service.listConversations(userIdOf(c))),
    )
    .post('/', chatUsers, validate('json', createConversationBodySchema), async (c) => {
      const { recipientId } = c.req.valid('json')
      return created(
        c,
        chatConversationSchema,
        await service.getOrCreateConversation(userIdOf(c), recipientId),
      )
    })
    .get('/:id/messages', chatUsers, validate('param', idParamsSchema), async (c) =>
      ok(
        c,
        chatMessageListSchema,
        await service.listMessages(c.req.valid('param').id, userIdOf(c)),
      ),
    )
    .post(
      '/:id/messages',
      chatUsers,
      validate('param', idParamsSchema),
      validate('json', createEncryptedMessageBodySchema),
      async (c) => {
        const conversationId = c.req.valid('param').id
        const params = { conversationId, senderId: userIdOf(c), body: c.req.valid('json') }
        return created(c, chatMessageSchema, await service.sendMessage(params))
      },
    )

export const createChatRoutes = (service: ChatService): Hono<AppEnv> =>
  new Hono<AppEnv>()
    .get('/contacts', chatUsers, async (c) =>
      ok(c, chatContactListSchema, await service.listContacts(userIdOf(c))),
    )
    .route('/keys', createKeysRouter(service))
    .route('/conversations', createConversationsRouter(service))
