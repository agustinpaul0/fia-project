import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { ChatInput } from './chat-input'

const type = (text: string): HTMLElement => {
  const input = screen.getByPlaceholderText(/Escribí un mensaje cifrado/)
  fireEvent.change(input, { target: { value: text } })
  return input
}

describe('ChatInput', () => {
  it('envía el texto sin espacios de más y limpia el campo', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined)
    render(<ChatInput onSend={onSend} />)
    const input = type('  Mensaje confidencial  ')
    fireEvent.click(screen.getByRole('button', { name: /Enviar/ }))
    expect(onSend).toHaveBeenCalledWith('Mensaje confidencial')
    await waitFor(() => expect(input).toHaveValue(''))
  })

  it('no envía texto en blanco y deshabilita el botón', () => {
    const onSend = vi.fn()
    render(<ChatInput onSend={onSend} />)
    type('   ')
    expect(screen.getByRole('button', { name: /Enviar/ })).toBeDisabled()
    fireEvent.submit(screen.getByRole('button', { name: /Enviar/ }))
    expect(onSend).not.toHaveBeenCalled()
  })

  it('bloquea un segundo envío mientras el primero está en curso', async () => {
    let finish: () => void = () => undefined
    const onSend = vi.fn(() => new Promise<void>((resolve) => (finish = resolve)))
    render(<ChatInput onSend={onSend} />)
    const input = type('Hola')
    fireEvent.click(screen.getByRole('button', { name: /Enviar/ }))
    expect(input).toBeDisabled()
    fireEvent.submit(input)
    expect(onSend).toHaveBeenCalledTimes(1)
    finish()
    await waitFor(() => expect(input).toBeEnabled())
  })

  it('conserva el texto si el envío falla', async () => {
    const onSend = vi.fn().mockRejectedValue(new Error('red'))
    render(<ChatInput onSend={onSend} />)
    const input = type('Hola')
    fireEvent.submit(input)
    await waitFor(() => expect(input).toBeEnabled())
    expect(input).toHaveValue('Hola')
  })

  it('queda deshabilitado si el canal no está listo', () => {
    render(<ChatInput onSend={vi.fn()} disabled />)
    expect(screen.getByPlaceholderText(/Escribí un mensaje cifrado/)).toBeDisabled()
  })
})
