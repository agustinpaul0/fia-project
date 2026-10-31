import { z } from 'zod'
import { CHAT_ROLES } from '../domain/roles'
import { versionSchema } from './common'

export const registerPublicKeysBodySchema = z.strictObject({
  ecdhPublicKey: z.string().min(10, 'La clave pública ECDH es requerida.'),
  ecdsaPublicKey: z.string().min(10, 'La clave pública ECDSA es requerida.'),
})

export const userPublicKeysSchema = z.strictObject({
  userId: z.string(),
  userName: z.string(),
  userRole: z.string(),
  teamName: z.string().nullable(),
  ecdhPublicKey: z.string(),
  ecdsaPublicKey: z.string(),
})

const userIdSchema = z.string().min(1, 'Elegí un destinatario válido.').max(64)

export const chatUserParamsSchema = z.strictObject({ userId: userIdSchema })

export const createConversationBodySchema = z.strictObject({ recipientId: userIdSchema })

export const chatContactSchema = z.strictObject({
  id: z.string(),
  name: z.string(),
  role: z.enum(CHAT_ROLES),
  teamName: z.string().nullable(),
})

export const chatContactListSchema = z.array(chatContactSchema).readonly()

export const chatConversationSchema = z.strictObject({
  id: z.uuid(),
  otherUserId: z.string(),
  otherUserName: z.string(),
  otherUserRole: z.string(),
  otherTeamName: z.string().nullable(),
  createdAt: z.iso.datetime(),
})

export const chatConversationListSchema = z.array(chatConversationSchema).readonly()

export const createEncryptedMessageBodySchema = z.strictObject({
  encryptedContent: z.string().min(1, 'El contenido cifrado no puede estar vacío.'),
  iv: z.string().min(12, 'El vector de inicialización es requerido.'),
  signature: z.string().min(16, 'La firma criptográfica es requerida.'),
})

export const chatMessageSchema = z.strictObject({
  id: z.uuid(),
  conversationId: z.uuid(),
  senderId: z.string(),
  senderName: z.string(),
  recipientId: z.string(),
  encryptedContent: z.string(),
  iv: z.string(),
  signature: z.string(),
  sentAt: z.iso.datetime(),
  version: versionSchema,
})

export const chatMessageListSchema = z.array(chatMessageSchema).readonly()

export type RegisterPublicKeysBody = z.infer<typeof registerPublicKeysBodySchema>
export type UserPublicKeys = z.infer<typeof userPublicKeysSchema>
export type CreateConversationBody = z.infer<typeof createConversationBodySchema>
export type ChatContact = z.infer<typeof chatContactSchema>
export type ChatConversation = z.infer<typeof chatConversationSchema>
export type ChatConversationList = z.infer<typeof chatConversationListSchema>
export type CreateEncryptedMessageBody = z.infer<typeof createEncryptedMessageBodySchema>
export type ChatMessage = z.infer<typeof chatMessageSchema>
export type ChatMessageList = z.infer<typeof chatMessageListSchema>
