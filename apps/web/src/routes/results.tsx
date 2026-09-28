import { createFileRoute } from '@tanstack/react-router'
import { SeasonResultsView } from '@/features/race-results/components/season-results-view'

export const Route = createFileRoute('/results')({ component: () => <SeasonResultsView /> })
