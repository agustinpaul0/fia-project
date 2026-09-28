import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { RaceClassificationView } from '@/features/race-results/components/race-classification-view'

const RacePage = (): ReactNode => {
  const { raceId } = Route.useParams()
  return <RaceClassificationView raceId={raceId} />
}

export const Route = createFileRoute('/races/$raceId')({ component: RacePage })
