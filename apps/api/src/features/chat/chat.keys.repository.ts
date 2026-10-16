import { user, userPublicKeys } from '@fia/shared/db'
import { eq } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ChatRepository } from './chat.port'
import { userKeysSelect } from './chat.sql'
import { loadTeamNames } from './chat.team-names'

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
      .where(eq(userPublicKeys.userId, userId))
      .limit(1)
    if (!row) {
      return null
    }
    const { teamId, ...keys } = row
    return { ...keys, teamName: (await loadTeamNames(db))(teamId) }
  },
})
