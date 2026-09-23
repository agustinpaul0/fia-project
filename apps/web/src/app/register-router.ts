import type { AppRouter } from './create-router'

declare module '@tanstack/react-router' {
  interface Register {
    router: AppRouter
  }
}
