import { CATEGORY_CODE_PATTERN } from '@fia/shared/contracts'
import { createFileRoute } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { z } from 'zod'
import { SeasonResultsView } from '@/features/race-results/components/season-results-view'

export const DEFAULT_CATEGORY = 'F1'

const resultsSearchSchema = z.object({
  category: z.string().regex(CATEGORY_CODE_PATTERN).optional().catch(undefined),
})

const ResultsPage = (): ReactNode => {
  const { category } = Route.useSearch()
  return <SeasonResultsView category={category ?? DEFAULT_CATEGORY} />
}

export const Route = createFileRoute('/results')({
  validateSearch: (search) => resultsSearchSchema.parse(search),
  component: ResultsPage,
})
