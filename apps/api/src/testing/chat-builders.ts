import type { ChatContact } from '@fia/shared/contracts'
import type { SessionUser } from '../core/auth/session'

export const CHAT_ADMIN: SessionUser = { id: 'admin-1', role: 'fia_admin', teamId: null }
export const CHAT_STAFF: SessionUser = { id: 'staff-1', role: 'team_staff', teamId: 'team-1' }
export const CHAT_OUTSIDER: SessionUser = { id: 'staff-2', role: 'team_staff', teamId: 'team-2' }

export const CHAT_CONTACTS: readonly ChatContact[] = [
  { id: 'admin-1', name: 'Admin FIA', role: 'fia_admin', teamName: null },
  { id: 'staff-1', name: 'Charles Leclerc', role: 'team_staff', teamName: 'Ferrari' },
  { id: 'staff-2', name: 'Lando Norris', role: 'team_staff', teamName: 'McLaren' },
]

export const PUBLIC_KEYS = {
  ecdhPublicKey: '{"kty":"EC","crv":"P-256","x":"ecdh"}',
  ecdsaPublicKey: '{"kty":"EC","crv":"P-256","x":"ecdsa"}',
}

export const ENCRYPTED_BODY = {
  encryptedContent: 'aW5pdGlhbFBheWxvYWQ=',
  iv: 'MTIzNDU2Nzg5MDEy',
  signature: 'c2lnbmF0dXJlRXhhbXBsZVN0cmluZw==',
}
