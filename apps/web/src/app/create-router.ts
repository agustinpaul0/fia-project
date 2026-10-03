import type { QueryClient } from '@tanstack/react-query'
import { createRouter } from '@tanstack/react-router'
import { routeTree } from '../routeTree.gen'
import { NotFoundPage } from './not-found-page'
import { RouteErrorFallback } from './route-error-fallback'

export const createAppRouter = (queryClient: QueryClient) =>
  createRouter({
    routeTree,
    context: { queryClient },
    defaultErrorComponent: RouteErrorFallback,
    defaultNotFoundComponent: NotFoundPage,
    defaultPreload: 'intent',
    defaultViewTransition: true,
  })

export type AppRouter = ReturnType<typeof createAppRouter>
