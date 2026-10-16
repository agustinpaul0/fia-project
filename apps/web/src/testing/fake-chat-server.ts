import type {
  ChatConversation,
  ChatMessage,
  CreateEncryptedMessageBody,
  RegisterPublicKeysBody,
} from '@fia/shared/contracts'
import { exportJwk } from '@/features/chat/crypto/crypto-utils'
import type { ClientKeyStore } from '@/features/chat/crypto/key-storage'
import { jsonResponse } from './mock-fetch'
import { mockFetchRoutes, type RecordedCall, type RouteKey } from './mock-fetch-routes'

export const ME = 'alice'
export const PEER = { id: 'bob', name: 'Bob Staff', teamName: 'Ferrari' }
const CONV_ID = '00000000-0000-4000-8000-000000000001'
const MESSAGES_PATH = `/chat/conversations/${CONV_ID}/messages`

export const CONVERSATION: ChatConversation = {
  id: CONV_ID,
  otherUserId: PEER.id,
  otherUserName: PEER.name,
  otherUserRole: 'team_staff',
  otherTeamName: PEER.teamName,
  createdAt: '2026-10-16T12:00:00.000Z',
}

export type FakeChatServer = {
  readonly calls: readonly RecordedCall[]
  readonly myPublicKeys: () => RegisterPublicKeysBody | null
  readonly deliver: (senderId: string, body: CreateEncryptedMessageBody) => void
}

const KEY_NOT_FOUND = {
  error: { code: 'CHAT_KEY_NOT_FOUND', message: 'Sin claves.', fields: null },
}

const peerKeysOf = async (peer: ClientKeyStore | null) =>
  peer && {
    userId: PEER.id,
    userName: PEER.name,
    userRole: 'team_staff',
    teamName: PEER.teamName,
    ecdhPublicKey: await exportJwk(peer.ecdh.publicKey),
    ecdsaPublicKey: await exportJwk(peer.ecdsa.publicKey),
  }

const createMailbox = () => {
  const messages: ChatMessage[] = []
  const deliver = (senderId: string, body: CreateEncryptedMessageBody): void => {
    const mine = senderId === ME
    messages.push({
      id: `00000000-0000-4000-8000-${String(messages.length + 10).padStart(12, '0')}`,
      conversationId: CONV_ID,
      senderId,
      senderName: mine ? 'Alice FIA' : PEER.name,
      recipientId: mine ? PEER.id : ME,
      ...body,
      sentAt: '2026-10-16T12:00:00.000Z',
      version: 1,
    })
  }
  return { messages, deliver }
}

const lastBody = <T>(calls: readonly RecordedCall[], key: RouteKey): T | null => {
  const call = calls.findLast((c) => c.key === key)
  return call ? (call.body as T) : null
}

export const startFakeChatServer = async (peer: ClientKeyStore | null): Promise<FakeChatServer> => {
  const { messages, deliver } = createMailbox()
  const peerKeys = await peerKeysOf(peer)
  let opened = false
  const calls: readonly RecordedCall[] = mockFetchRoutes({
    'POST /chat/keys': () => jsonResponse(lastBody(calls, 'POST /chat/keys')),
    'GET /chat/contacts': () => jsonResponse([{ ...PEER, role: 'team_staff' }]),
    [`GET /chat/keys/${PEER.id}`]: () =>
      peerKeys ? jsonResponse(peerKeys) : jsonResponse(KEY_NOT_FOUND, 404),
    'GET /chat/conversations': () => jsonResponse(opened ? [CONVERSATION] : []),
    'POST /chat/conversations': () => {
      opened = true
      return jsonResponse(CONVERSATION, 201)
    },
    [`GET ${MESSAGES_PATH}`]: () => jsonResponse(messages),
    [`POST ${MESSAGES_PATH}`]: () => {
      const body = lastBody<CreateEncryptedMessageBody>(calls, `POST ${MESSAGES_PATH}`)
      deliver(ME, body ?? { encryptedContent: '', iv: '', signature: '' })
      return jsonResponse(messages.at(-1), 201)
    },
  })
  const myPublicKeys = () => lastBody<RegisterPublicKeysBody>(calls, 'POST /chat/keys')
  return { calls, myPublicKeys, deliver }
}
