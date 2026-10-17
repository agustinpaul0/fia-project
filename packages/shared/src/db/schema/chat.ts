import { index, pgTable, text, timestamp, uniqueIndex, uuid, varchar } from 'drizzle-orm/pg-core'
import { user } from './auth'
import { idColumn, versionedChecks, versionedColumns } from './columns'

export const userPublicKeys = pgTable('user_public_keys', {
  userId: text('user_id')
    .primaryKey()
    .references(() => user.id, { onDelete: 'cascade' }),
  ecdhPublicKey: text('ecdh_public_key').notNull(),
  ecdsaPublicKey: text('ecdsa_public_key').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
})

export const chatConversations = pgTable(
  'chat_conversations',
  {
    id: idColumn(),
    userAId: text('user_a_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    userBId: text('user_b_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex('chat_conv_users_idx').on(table.userAId, table.userBId),
    index('chat_conv_user_a_idx').on(table.userAId),
    index('chat_conv_user_b_idx').on(table.userBId),
  ],
)

export const chatMessages = pgTable(
  'chat_messages',
  {
    id: idColumn(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => chatConversations.id, { onDelete: 'cascade' }),
    senderId: text('sender_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    recipientId: text('recipient_id')
      .notNull()
      .references(() => user.id, { onDelete: 'cascade' }),
    encryptedContent: text('encrypted_content').notNull(),
    iv: varchar('iv', { length: 64 }).notNull(),
    signature: text('signature').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true, mode: 'date' }).notNull(),
    ...versionedColumns(),
  },
  (table) => [
    index('chat_messages_conv_sent_idx').on(table.conversationId, table.sentAt),
    index('chat_messages_sender_idx').on(table.senderId),
    index('chat_messages_recipient_idx').on(table.recipientId),
    ...versionedChecks('chat_messages', table),
  ],
)

export type UserPublicKeyRow = typeof userPublicKeys.$inferSelect
export type ChatConversationRow = typeof chatConversations.$inferSelect
export type ChatMessageRow = typeof chatMessages.$inferSelect
