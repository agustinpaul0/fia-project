import type { CreateEncryptedMessageBody } from '@fia/shared/contracts'
import { withIdbStore } from './idb'

export type OutboxItem = {
  readonly id: string
  readonly conversationId: string
  readonly body: CreateEncryptedMessageBody
  readonly createdAt: string
}

export type OutboxStorage = {
  readonly list: (conversationId: string) => Promise<readonly OutboxItem[]>
  readonly conversationsWithPending: () => Promise<readonly string[]>
  readonly add: (item: OutboxItem) => Promise<void>
  readonly remove: (id: string) => Promise<void>
}

const OUTBOX_DB = { dbName: 'fia-chat-outbox', store: 'items', keyPath: 'id' } as const

const ofConversation = (items: readonly OutboxItem[], conversationId: string) =>
  items
    .filter((i) => i.conversationId === conversationId)
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt))

const conversationsOf = (items: readonly OutboxItem[]): readonly string[] => [
  ...new Set(items.map((i) => i.conversationId)),
]

const readAll = async (): Promise<readonly OutboxItem[]> =>
  (await withIdbStore(OUTBOX_DB, 'readonly', (s) => s.getAll())) as OutboxItem[]

export const indexedDbOutbox: OutboxStorage = {
  list: async (conversationId) => ofConversation(await readAll(), conversationId),
  conversationsWithPending: async () => conversationsOf(await readAll()),
  add: async (item) => {
    await withIdbStore(OUTBOX_DB, 'readwrite', (s) => s.put(item))
  },
  remove: async (id) => {
    await withIdbStore(OUTBOX_DB, 'readwrite', (s) => s.delete(id))
  },
}

export const createMemoryOutbox = (): OutboxStorage => {
  const items = new Map<string, OutboxItem>()
  return {
    list: async (conversationId) => ofConversation([...items.values()], conversationId),
    conversationsWithPending: async () => conversationsOf([...items.values()]),
    add: async (item) => {
      items.set(item.id, item)
    },
    remove: async (id) => {
      items.delete(id)
    },
  }
}
