import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { FIA_ADMIN, fixedSessionResolver } from '../../testing/session-users'
import type { BetterAuthInstance } from './better-auth'
import {
  type AppEnv,
  anonymousSessionResolver,
  createBetterAuthSessionResolver,
  resolveSession,
} from './session'

const whoAmI = (app: Hono<AppEnv>) =>
  app.get('/', (c) => c.json({ user: c.get('sessionUser') })).request('/')

describe('resolución de sesión', () => {
  it('sin autenticación la sesión es anónima', async () => {
    const app = new Hono<AppEnv>().use(resolveSession(anonymousSessionResolver))
    expect(await (await whoAmI(app)).json()).toEqual({ user: null })
  })

  it('expone el usuario resuelto a los handlers', async () => {
    const app = new Hono<AppEnv>().use(resolveSession(fixedSessionResolver(FIA_ADMIN)))
    expect(await (await whoAmI(app)).json()).toEqual({ user: FIA_ADMIN })
  })

  it('resuelve null si better-auth no devuelve sesión', async () => {
    const fakeAuth = { api: { getSession: () => Promise.resolve(null) } }
    const resolver = createBetterAuthSessionResolver(fakeAuth as unknown as BetterAuthInstance)
    const app = new Hono<AppEnv>().use(resolveSession(resolver))
    expect(await (await whoAmI(app)).json()).toEqual({ user: null })
  })

  it('resuelve el usuario y rol de better-auth', async () => {
    const fakeAuth = {
      api: {
        getSession: () =>
          Promise.resolve({
            user: { id: 'usr_1', role: 'fia_admin', teamId: 'tm_1' },
          }),
      },
    }
    const resolver = createBetterAuthSessionResolver(fakeAuth as unknown as BetterAuthInstance)
    const app = new Hono<AppEnv>().use(resolveSession(resolver))
    expect(await (await whoAmI(app)).json()).toEqual({
      user: { id: 'usr_1', role: 'fia_admin', teamId: 'tm_1' },
    })
  })
})
