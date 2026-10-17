import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { TechnicalControlsSection } from '@/features/technical-controls/components/technical-controls-section'

const ScrutineeringPage = (): ReactNode => <TechnicalControlsSection />

export const Route = createFileRoute('/scrutineering')({ component: ScrutineeringPage })
