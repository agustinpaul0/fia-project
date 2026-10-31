import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { CONVERSATION } from '@/testing/fake-chat-server'
import { ChatConversationList } from './chat-conversation-list'
import { ChatSecurityBadge } from './chat-security-badge'

const ADMIN_CHAT = {
  ...CONVERSATION,
  id: '00000000-0000-4000-8000-000000000002',
  otherUserName: 'Admin FIA',
  otherUserRole: 'fia_admin',
  otherTeamName: null,
}

describe('ChatConversationList', () => {
  it('muestra el estado de carga y el vacío', () => {
    const { rerender } = render(
      <ChatConversationList isLoading conversations={[]} selectedId={null} onSelect={vi.fn()} />,
    )
    expect(screen.getByText('Cargando chats...')).toBeInTheDocument()
    rerender(
      <ChatConversationList
        isLoading={false}
        conversations={[]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('No tenés conversaciones iniciadas.')).toBeInTheDocument()
  })

  it('lista cada contacto con su rol y escudería, y marca el elegido', () => {
    const onSelect = vi.fn()
    render(
      <ChatConversationList
        isLoading={false}
        conversations={[CONVERSATION, ADMIN_CHAT]}
        selectedId={CONVERSATION.id}
        onSelect={onSelect}
      />,
    )
    const [bob, admin] = screen.getAllByRole('button')
    expect(bob).toHaveTextContent('Bob StaffEscuderíaFerrari')
    expect(bob).toHaveClass('bg-primary')
    expect(admin).toHaveTextContent('Admin FIAFIA Admin')
    expect(admin).not.toHaveClass('bg-primary')
    fireEvent.click(screen.getByText('Admin FIA'))
    expect(onSelect).toHaveBeenCalledWith(ADMIN_CHAT.id)
  })

  it('el indicador de seguridad nombra los algoritmos usados', () => {
    render(<ChatSecurityBadge />)
    expect(screen.getByText('(ECDH P-256 · AES-GCM 256 · Firma ECDSA)')).toBeInTheDocument()
  })
})

describe('ChatConversationList con pilotos (US-27)', () => {
  it('distingue la cuenta oficial de un piloto con su insignia', () => {
    const driverChat = {
      ...CONVERSATION,
      id: '00000000-0000-4000-8000-000000000003',
      otherUserName: 'Franco Colapinto',
      otherUserRole: 'driver',
      otherTeamName: null,
    }
    render(
      <ChatConversationList
        isLoading={false}
        conversations={[CONVERSATION, driverChat]}
        selectedId={null}
        onSelect={vi.fn()}
      />,
    )
    expect(screen.getByText('Piloto')).toBeInTheDocument()
    expect(screen.getAllByText(/Piloto oficial/)).toHaveLength(1)
  })
})
