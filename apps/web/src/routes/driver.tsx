import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RequireDriver } from '@/features/auth/guards/require-driver'
import { DriverHome } from '@/features/driver-area/components/driver-home'

const DriverPage = (): ReactNode => (
  <RequireDriver>
    <DriverHome />
  </RequireDriver>
)

export const Route = createFileRoute('/driver')({ component: DriverPage })
