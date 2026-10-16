import type { SessionUser } from '../core/auth/session'
import { CHAT_CONTACTS } from './chat-builders'
import { aDriverRow } from './driver-row-builders'
import { FIA_ADMIN } from './session-users'
import { createTestApp } from './test-app'

export const INCREMENT_TEAM = { id: '00000000-0000-4000-8000-000000000010', name: 'Ferrari' }
export const INCREMENT_STAFF: SessionUser = {
  id: 'staff-1',
  role: 'team_staff',
  teamId: INCREMENT_TEAM.id,
}
export const INCREMENT_DRIVER = aDriverRow({ teamId: INCREMENT_TEAM.id })

export const sharedIncrementApp = () => {
  const ctx = createTestApp({
    sessionUser: FIA_ADMIN,
    teams: [INCREMENT_TEAM],
    teamDrivers: [INCREMENT_DRIVER],
    chatContacts: CHAT_CONTACTS,
  })
  const { app: _admin, ...sharedRepositories } = ctx
  return (user: SessionUser | null) => createTestApp({ sessionUser: user, sharedRepositories }).app
}
