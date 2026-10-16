import { chatConversations, chatMessages, user, userPublicKeys } from '@fia/shared/db'
import { and, desc, eq, or } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'

export const userKeysSelect = {
  userId: userPublicKeys.userId,
  userName: user.name,
  userRole: user.role,
  teamId: user.teamId,
  ecdhPublicKey: userPublicKeys.ecdhPublicKey,
  ecdsaPublicKey: userPublicKeys.ecdsaPublicKey,
}

export const messageSelect = {
  id: chatMessages.id,
  conversationId: chatMessages.conversationId,
  senderId: chatMessages.senderId,
  senderName: user.name,
  recipientId: chatMessages.recipientId,
  encryptedContent: chatMessages.encryptedContent,
  iv: chatMessages.iv,
  signature: chatMessages.signature,
  sentAt: chatMessages.sentAt,
  version: chatMessages.version,
}

export const fetchConversationUsers = (userId: string, recipientId: string) => {
  const [userAId, userBId] = [userId, recipientId].sort()
  return { userAId: userAId ?? userId, userBId: userBId ?? recipientId }
}

export const findConversationQuery = (db: DbExecutor, userAId: string, userBId: string) =>
  db
    .select({ id: chatConversations.id })
    .from(chatConversations)
    .where(and(eq(chatConversations.userAId, userAId), eq(chatConversations.userBId, userBId)))
    .limit(1)

export const listUserConversationsQuery = (db: DbExecutor, userId: string) =>
  db
    .select()
    .from(chatConversations)
    .where(or(eq(chatConversations.userAId, userId), eq(chatConversations.userBId, userId)))
    .orderBy(desc(chatConversations.updatedAt))
