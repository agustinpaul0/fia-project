import '@/styles.css'
import '@/app/register-router'
import { configureSpanishValidation } from '@fia/shared/contracts'
import { QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from '@tanstack/react-router'
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createAppRouter } from '@/app/create-router'
import { createQueryClient } from '@/lib/query-client'

configureSpanishValidation()

const queryClient = createQueryClient()
const router = createAppRouter(queryClient)
const container = document.getElementById('root')

if (container !== null) {
  createRoot(container).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  )
}
