import { Hono } from 'hono'
import { describe, expect, it } from 'vitest'
import { FIA_ADMIN, fixedSessionResolver } from '../../testing/session-users'
import { type AppEnv, anonymousSessionResolver, resolveSession } from './session'

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
})
