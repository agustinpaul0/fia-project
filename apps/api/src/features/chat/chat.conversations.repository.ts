import type { ChatConversation } from '@fia/shared/contracts'
import { chatConversations, user } from '@fia/shared/db'
import { AppError } from '@fia/shared/domain'
import { and, eq, or } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ChatRepository } from './chat.port'
import {
  fetchConversationUsers,
  findConversationQuery,
  listUserConversationsQuery,
} from './chat.sql'
import { loadTeamNames } from './chat.team-names'

const fetchOtherUserData = async (db: DbExecutor, otherId: string) => {
  const [u] = await db
    .select({ name: user.name, role: user.role, teamId: user.teamId })
    .from(user)
    .where(eq(user.id, otherId))
    .limit(1)
  return u ? { ...u, teamName: (await loadTeamNames(db))(u.teamId) } : undefined
}

const executeListConversations = async (
  db: DbExecutor,
  userId: string,
): Promise<ChatConversation[]> => {
  const rows = await listUserConversationsQuery(db, userId)
  const result: ChatConversation[] = []
  for (const row of rows) {
    const otherId = row.userAId === userId ? row.userBId : row.userAId
    const u = await fetchOtherUserData(db, otherId)
    if (u) {
      result.push({
        id: row.id,
        otherUserId: otherId,
        otherUserName: u.name,
        otherUserRole: u.role,
        otherTeamName: u.teamName ?? null,
        createdAt: row.createdAt.toISOString(),
      })
    }
  }
  return result
}

const executeGetOrCreate = async (
  db: DbExecutor,
  userId: string,
  recipientId: string,
): Promise<ChatConversation> => {
  const { userAId, userBId } = fetchConversationUsers(userId, recipientId)
  const [existing] = await findConversationQuery(db, userAId, userBId)
  const u = await fetchOtherUserData(db, recipientId)
  if (existing) {
    return {
      id: existing.id,
      otherUserId: recipientId,
      otherUserName: u?.name ?? '',
      otherUserRole: u?.role ?? '',
      otherTeamName: u?.teamName ?? null,
      createdAt: new Date().toISOString(),
    }
  }
  const [created] = await db
    .insert(chatConversations)
    .values({ userAId, userBId })
    .returning({ id: chatConversations.id, createdAt: chatConversations.createdAt })
  if (!created) {
    throw new AppError('INTERNAL_ERROR')
  }
  return {
    id: created.id,
    otherUserId: recipientId,
    otherUserName: u?.name ?? '',
    otherUserRole: u?.role ?? '',
    otherTeamName: u?.teamName ?? null,
    createdAt: created.createdAt.toISOString(),
  }
}

export const createChatConversationsRepository = (
  db: DbExecutor,
): Pick<ChatRepository, 'listConversations' | 'getOrCreateConversation' | 'isParticipant'> => ({
  listConversations: (userId) => executeListConversations(db, userId),
  getOrCreateConversation: (userId, recipientId) => executeGetOrCreate(db, userId, recipientId),
  isParticipant: async (convId, userId) => {
    const [row] = await db
      .select({ id: chatConversations.id })
      .from(chatConversations)
      .where(
        and(
          eq(chatConversations.id, convId),
          or(eq(chatConversations.userAId, userId), eq(chatConversations.userBId, userId)),
        ),
      )
      .limit(1)
    return Boolean(row)
  },
})
