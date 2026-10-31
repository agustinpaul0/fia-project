import { errorResponseSchema } from '@fia/shared/contracts'
import fc from 'fast-check'
import { describe, expect, it } from 'vitest'
import { driverAccountsAppAs, postDriverAccount } from '../../testing/driver-account-fixture'
import { FIA_ADMIN } from '../../testing/session-users'

const app = driverAccountsAppAs(FIA_ADMIN)

describe('Fuzz de /driver-accounts', () => {
  it('POST con payloads arbitrarios nunca responde 5xx', async () => {
    await fc.assert(
      fc.asyncProperty(fc.anything(), async (body) => {
        const response = await postDriverAccount(app, body)
        expect(response.status).toBeLessThan(500)
        if (response.status >= 400) {
          expect(errorResponseSchema.safeParse(await response.json()).success).toBe(true)
        }
      }),
    )
  })
})
