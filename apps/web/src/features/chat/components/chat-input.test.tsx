import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChatInput } from './chat-input'

describe('ChatInput', () => {
  it('envía el texto y limpia el campo', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined)
    render(<ChatInput onSend={onSend} />)

    const input = screen.getByPlaceholderText(/Escribí un mensaje cifrado/)
    fireEvent.change(input, { target: { value: 'Mensaje confidencial' } })

    const btn = screen.getByRole('button', { name: /Enviar/ })
    fireEvent.click(btn)

    expect(onSend).toHaveBeenCalledWith('Mensaje confidencial')
  })

  it('no envía si el texto está en blanco', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)

    const btn = screen.getByRole('button', { name: /Enviar/ })
    fireEvent.click(btn)

    expect(onSend).not.toHaveBeenCalled()
  })
})
