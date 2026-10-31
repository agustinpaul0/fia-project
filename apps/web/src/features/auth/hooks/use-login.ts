import { useNavigate } from '@tanstack/react-router'
import { type FormEvent, useState } from 'react'
import { signIn } from '@/lib/auth-client'
import { homeFor } from '../role-home'

export type LoginState = {
  readonly email: string
  readonly password: string
  readonly error: string | null
  readonly loading: boolean
  readonly setEmail: (value: string) => void
  readonly setPassword: (value: string) => void
  readonly submit: (event: FormEvent) => Promise<void>
}

const GENERIC_ERROR = 'Credenciales inválidas.'
const RATE_LIMITED_ERROR = 'Hiciste demasiados intentos. Esperá unos minutos y volvé a probar.'

export const useLogin = (): LoginState => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const submit = async (event: FormEvent): Promise<void> => {
    event.preventDefault()
    setError(null)
    setLoading(true)
    const { data, error: signInError } = await signIn.email({ email, password })
    setLoading(false)
    if (signInError) {
      setError(signInError.status === 429 ? RATE_LIMITED_ERROR : GENERIC_ERROR)
      return
    }
    void navigate({ to: homeFor(data?.user.role) })
  }
  return { email, password, error, loading, setEmail, setPassword, submit }
}
