import type { DbExecutor } from '../../core/db/executor'
import { createChatConversationsRepository } from './chat.conversations.repository'
import { createChatKeysRepository } from './chat.keys.repository'
import { createChatMessagesRepository } from './chat.messages.repository'
import type { ChatRepository } from './chat.port'

export const createDrizzleChatRepository = (db: DbExecutor): ChatRepository => ({
  ...createChatKeysRepository(db),
  ...createChatConversationsRepository(db),
  ...createChatMessagesRepository(db),
})
