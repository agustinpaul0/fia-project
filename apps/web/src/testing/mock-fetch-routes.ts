import { vi } from 'vitest'

export type RouteKey = `${'GET' | 'POST' | 'PUT' | 'DELETE'} ${string}`

export type RecordedCall = {
  readonly key: RouteKey
  readonly body: unknown
}

const keyOf = (url: string, init: RequestInit | undefined): RouteKey => {
  const { pathname, search } = new URL(url)
  const method = (init?.method ?? 'GET') as 'GET'
  return `${method} ${pathname}${search}`
}

export const mockFetchRoutes = (
  routes: Readonly<Record<RouteKey, () => Response>>,
): readonly RecordedCall[] => {
  const calls: RecordedCall[] = []
  vi.stubGlobal(
    'fetch',
    vi.fn((url: string, init?: RequestInit) => {
      const key = keyOf(url, init)
      const body = typeof init?.body === 'string' ? JSON.parse(init.body) : null
      calls.push({ key, body })
      const handler = routes[key]
      return Promise.resolve(
        handler === undefined ? new Response(null, { status: 404 }) : handler(),
      )
    }),
  )
  return calls
}
