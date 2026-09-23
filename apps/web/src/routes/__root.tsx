import { createRootRouteWithContext } from '@tanstack/react-router'
import { NotFoundPage } from '@/app/not-found-page'
import { RootLayout } from '@/app/root-layout'
import { RouteErrorFallback } from '@/app/route-error-fallback'
import type { RouterContext } from '@/app/router-context'

export const Route = createRootRouteWithContext<RouterContext>()({
  component: RootLayout,
  errorComponent: RouteErrorFallback,
  notFoundComponent: NotFoundPage,
})
