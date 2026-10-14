import { chatConversations, chatMessages, user } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { asc, eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ChatRepository, SendMessageParams } from './chat.port'
import { messageSelect } from './chat.sql'

const fetchRecipientId = async (
  db: DbExecutor,
  conversationId: string,
  senderId: string,
): Promise<string> => {
  const [conv] = await db
    .select({ userAId: chatConversations.userAId, userBId: chatConversations.userBId })
    .from(chatConversations)
    .where(eq(chatConversations.id, conversationId))
    .limit(1)
  if (!conv) {
    throw new AppError('CONVERSATION_NOT_FOUND')
  }
  return conv.userAId === senderId ? conv.userBId : conv.userAId
}

const insertMessage = async (db: DbExecutor, p: SendMessageParams, recipientId: string) => {
  const [msg] = await db
    .insert(chatMessages)
    .values({
      conversationId: p.conversationId,
      senderId: p.senderId,
      recipientId,
      encryptedContent: p.body.encryptedContent,
      iv: p.body.iv,
      signature: p.body.signature,
      sentAt: new Date(),
    })
    .returning({
      id: chatMessages.id,
      sentAt: chatMessages.sentAt,
      version: chatMessages.version,
    })
  if (!msg) {
    throw new AppError('INTERNAL_ERROR')
  }
  const [sender] = await db
    .select({ name: user.name })
    .from(user)
    .where(eq(user.id, p.senderId))
    .limit(1)
  return {
    id: msg.id,
    conversationId: p.conversationId,
    senderId: p.senderId,
    senderName: sender?.name ?? '',
    recipientId,
    encryptedContent: p.body.encryptedContent,
    iv: p.body.iv,
    signature: p.body.signature,
    sentAt: msg.sentAt.toISOString(),
    version: msg.version,
  }
}

export const createChatMessagesRepository = (
  db: DbExecutor,
): Pick<ChatRepository, 'listMessages' | 'sendMessage'> => ({
  listMessages: async (conversationId) => {
    const rows = await db
      .select(messageSelect)
      .from(chatMessages)
      .innerJoin(user, eq(chatMessages.senderId, user.id))
      .where(eq(chatMessages.conversationId, conversationId))
      .orderBy(asc(chatMessages.sentAt))
    return rows.map((r) => ({ ...r, sentAt: r.sentAt.toISOString() }))
  },
  sendMessage: async (p) => {
    const recipientId = await fetchRecipientId(db, p.conversationId, p.senderId)
    return insertMessage(db, p, recipientId)
  },
})
