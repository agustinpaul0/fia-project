import { adminClient } from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'
import { API_URL } from './api/api-url'

export const authClient = createAuthClient({
  baseURL: API_URL,
  plugins: [adminClient()],
})

export const { useSession, signIn, signOut } = authClient
