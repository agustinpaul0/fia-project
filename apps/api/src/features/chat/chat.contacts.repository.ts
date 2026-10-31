import { user } from '@fia/shared/db'
import { CHAT_ROLES } from '@fia/shared/domain'
import { and, asc, eq, inArray, isNull, ne, or } from 'drizzle-orm'
import type { DbExecutor } from '../../core/db/executor'
import type { ChatRepository } from './chat.port'
import { loadTeamNames } from './chat.team-names'

const isChatRole = (role: string): role is (typeof CHAT_ROLES)[number] =>
  CHAT_ROLES.some((r) => r === role)

export const createChatContactsRepository = (
  db: DbExecutor,
): Pick<ChatRepository, 'listContacts'> => ({
  listContacts: async (userId) => {
    const rows = await db
      .select({ id: user.id, name: user.name, role: user.role, teamId: user.teamId })
      .from(user)
      .where(
        and(
          ne(user.id, userId),
          inArray(user.role, [...CHAT_ROLES]),
          or(eq(user.banned, false), isNull(user.banned)),
        ),
      )
      .orderBy(asc(user.name))
    const teamName = await loadTeamNames(db)
    return rows.flatMap((r) =>
      isChatRole(r.role)
        ? [{ id: r.id, name: r.name, role: r.role, teamName: teamName(r.teamId) }]
        : [],
    )
  },
})
