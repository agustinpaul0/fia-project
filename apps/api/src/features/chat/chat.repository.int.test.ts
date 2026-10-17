import { user } from '@fia/shared/db'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import {
  connectDatabase,
  type DatabaseConnection,
  type DatabaseTransaction,
} from '../../core/db/client'
import { ENCRYPTED_BODY, PUBLIC_KEYS } from '../../testing/chat-builders'
import { testDatabaseUrl } from '../../testing/integration/test-database-url'
import { withRollback } from '../../testing/integration/with-rollback'
import { createDrizzleChatRepository } from './chat.repository'

const USERS = [
  { id: 'qa-chat-admin', role: 'fia_admin', banned: false },
  { id: 'qa-chat-staff', role: 'team_staff', banned: null },
  { id: 'qa-chat-other', role: 'team_staff', banned: false },
  { id: 'qa-chat-public', role: 'public', banned: false },
  { id: 'qa-chat-banned', role: 'team_staff', banned: true },
] as const

const seedUsers = async (tx: DatabaseTransaction): Promise<void> => {
  const now = new Date()
  await tx.insert(user).values(
    USERS.map((u) => ({
      ...u,
      name: u.id,
      email: `${u.id}@fia.com`,
      createdAt: now,
      updatedAt: now,
    })),
  )
}

describe('DrizzleChatRepository (Postgres real)', () => {
  let connection: DatabaseConnection

  beforeAll(() => {
    connection = connectDatabase(testDatabaseUrl())
  })

  afterAll(async () => {
    await connection.close()
  })

  it('ofrece como contactos sólo a la FIA y a escuderías activas, sin uno mismo', () =>
    withRollback(connection, async (tx) => {
      await seedUsers(tx)
      const contacts = await createDrizzleChatRepository(tx).listContacts('qa-chat-admin')
      const mine = contacts.filter((c) => c.id.startsWith('qa-chat-')).map((c) => c.id)
      expect(mine).toEqual(['qa-chat-other', 'qa-chat-staff'])
    }))

  it('guarda y reemplaza las claves públicas del usuario', () =>
    withRollback(connection, async (tx) => {
      await seedUsers(tx)
      const repo = createDrizzleChatRepository(tx)
      expect(await repo.getUserKeys('qa-chat-staff')).toBeNull()
      await repo.registerKeys('qa-chat-staff', PUBLIC_KEYS)
      await repo.registerKeys('qa-chat-staff', { ...PUBLIC_KEYS, ecdhPublicKey: 'rotada-123' })
      expect(await repo.getUserKeys('qa-chat-staff')).toMatchObject({ ecdhPublicKey: 'rotada-123' })
    }))

  it('reutiliza la conversación y sólo deja participar a sus dos usuarios', () =>
    withRollback(connection, async (tx) => {
      await seedUsers(tx)
      const repo = createDrizzleChatRepository(tx)
      const conv = await repo.getOrCreateConversation('qa-chat-admin', 'qa-chat-staff')
      const again = await repo.getOrCreateConversation('qa-chat-staff', 'qa-chat-admin')
      expect(again.id).toBe(conv.id)
      expect(await repo.isParticipant(conv.id, 'qa-chat-staff')).toBe(true)
      expect(await repo.isParticipant(conv.id, 'qa-chat-other')).toBe(false)
      const list = await repo.listConversations('qa-chat-staff')
      expect(list.map((c) => c.otherUserId)).toEqual(['qa-chat-admin'])
    }))

  it('guarda sólo el contenido cifrado y lo devuelve en orden', () =>
    withRollback(connection, async (tx) => {
      await seedUsers(tx)
      const repo = createDrizzleChatRepository(tx)
      const { id } = await repo.getOrCreateConversation('qa-chat-admin', 'qa-chat-staff')
      const sent = await repo.sendMessage({
        conversationId: id,
        senderId: 'qa-chat-staff',
        body: ENCRYPTED_BODY,
      })
      expect(sent).toMatchObject({
        ...ENCRYPTED_BODY,
        recipientId: 'qa-chat-admin',
        senderName: 'qa-chat-staff',
      })
      expect(await repo.listMessages(id)).toEqual([sent])
    }))
})
