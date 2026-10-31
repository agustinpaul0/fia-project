import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PublicDriversSection } from '@/features/team-drivers/components/public-drivers-section'

const DriversPage = (): ReactNode => <PublicDriversSection />

export const Route = createFileRoute('/drivers')({ component: DriversPage })
