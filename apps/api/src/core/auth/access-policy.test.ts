import { describe, expect, it } from 'vitest'
import { createTestApp } from '../../testing/test-app'
import { isAccessPolicy } from './access'

const MIDDLEWARE_METHOD = 'ALL'

describe('Política de acceso deny-by-default', () => {
  it('toda ruta declara publicAccess o requireRole', () => {
    const { app } = createTestApp()
    const endpoints = app.routes.filter((route) => route.method !== MIDDLEWARE_METHOD)
    const keys = new Set(endpoints.map((route) => `${route.method} ${route.path}`))
    const unprotected = [...keys].filter(
      (key) =>
        !endpoints.some(
          (route) => `${route.method} ${route.path}` === key && isAccessPolicy(route.handler),
        ),
    )
    expect(unprotected).toEqual([])
  })

  it('isAccessPolicy rechaza valores que no son políticas', () => {
    expect(isAccessPolicy(() => null)).toBe(false)
    expect(isAccessPolicy('texto')).toBe(false)
  })
})
