import { teams, user, userPublicKeys } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ChatRepository } from './chat.port'
import { userKeysSelect } from './chat.sql'

export const createChatKeysRepository = (
  db: DbExecutor,
): Pick<ChatRepository, 'registerKeys' | 'getUserKeys'> => ({
  registerKeys: async (userId, keys) => {
    await db
      .insert(userPublicKeys)
      .values({ userId, ecdhPublicKey: keys.ecdhPublicKey, ecdsaPublicKey: keys.ecdsaPublicKey })
      .onConflictDoUpdate({
        target: userPublicKeys.userId,
        set: {
          ecdhPublicKey: keys.ecdhPublicKey,
          ecdsaPublicKey: keys.ecdsaPublicKey,
          updatedAt: new Date(),
        },
      })
  },
  getUserKeys: async (userId) => {
    const [row] = await db
      .select(userKeysSelect)
      .from(userPublicKeys)
      .innerJoin(user, eq(userPublicKeys.userId, user.id))
      .leftJoin(teams, eq(user.teamId, teams.id))
      .where(eq(userPublicKeys.userId, userId))
      .limit(1)
    return row ? { ...row, teamName: row.teamName ?? null } : null
  },
})
