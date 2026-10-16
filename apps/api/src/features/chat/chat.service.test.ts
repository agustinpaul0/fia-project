import { describe, expect, it } from 'vitest'
import { CHAT_CONTACTS, ENCRYPTED_BODY, PUBLIC_KEYS } from '../../testing/chat-builders'
import { createInMemoryChatRepository } from '../../testing/in-memory-chat.repository'
import { createChatService } from './chat.service'

const setup = () => {
  const repo = createInMemoryChatRepository(CHAT_CONTACTS)
  return { repo, service: createChatService(repo) }
}

describe('ChatService', () => {
  it('devuelve las claves registradas o avisa que no existen', async () => {
    const { service } = setup()
    await expect(service.getUserKeys('staff-1')).rejects.toMatchObject({
      code: 'CHAT_KEY_NOT_FOUND',
    })
    await service.registerKeys('staff-1', PUBLIC_KEYS)
    expect(await service.getUserKeys('staff-1')).toMatchObject(PUBLIC_KEYS)
  })

  it('lista los contactos sin el propio usuario', async () => {
    const { service } = setup()
    expect((await service.listContacts('staff-1')).map((c) => c.id)).toEqual(['admin-1', 'staff-2'])
  })

  it('sólo abre conversaciones con contactos que tengan claves', async () => {
    const { service } = setup()
    await expect(service.getOrCreateConversation('admin-1', 'admin-1')).rejects.toMatchObject({
      code: 'INVALID_CHAT_RECIPIENT',
    })
    await expect(service.getOrCreateConversation('admin-1', 'otro')).rejects.toMatchObject({
      code: 'INVALID_CHAT_RECIPIENT',
    })
    await expect(service.getOrCreateConversation('admin-1', 'staff-1')).rejects.toMatchObject({
      code: 'CHAT_KEY_NOT_FOUND',
    })
    await service.registerKeys('staff-1', PUBLIC_KEYS)
    const conv = await service.getOrCreateConversation('admin-1', 'staff-1')
    expect(await service.getOrCreateConversation('admin-1', 'staff-1')).toEqual(conv)
    expect((await service.listConversations('staff-1')).map((c) => c.otherUserId)).toEqual([
      'admin-1',
    ])
  })

  it('impide leer o escribir a quien no participa de la conversación', async () => {
    const { service } = setup()
    await service.registerKeys('staff-1', PUBLIC_KEYS)
    const { id } = await service.getOrCreateConversation('admin-1', 'staff-1')
    const send = (senderId: string) =>
      service.sendMessage({ conversationId: id, senderId, body: ENCRYPTED_BODY })
    expect((await send('staff-1')).recipientId).toBe('admin-1')
    expect(await service.listMessages(id, 'admin-1')).toHaveLength(1)
    await expect(service.listMessages(id, 'staff-2')).rejects.toMatchObject({
      code: 'CONVERSATION_NOT_FOUND',
    })
    await expect(send('staff-2')).rejects.toMatchObject({ code: 'CONVERSATION_NOT_FOUND' })
  })
})
