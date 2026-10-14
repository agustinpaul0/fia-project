import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PenaltiesSection } from '@/features/penalties/components/penalties-section'

const SanctionsPage = (): ReactNode => <PenaltiesSection />

export const Route = createFileRoute('/sanctions')({ component: SanctionsPage })
