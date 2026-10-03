import type { ReactNode } from 'react'
import { PageQueryView } from '@/components/common/page-query-view'
import { useRaceClassification } from '../hooks/use-race-queries'
import { ClassificationTable } from './classification-table'
import { PointsDistribution } from './points-distribution'
import { RaceHero } from './race-hero'

export const RaceClassificationView = ({ raceId }: { readonly raceId: string }): ReactNode => (
  <PageQueryView query={useRaceClassification(raceId)}>
    {(classification) => (
      <div className="flex w-full flex-col">
        <RaceHero race={classification.race} hasResults={classification.results.length > 0} />
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-8">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
            <section className="flex flex-col gap-4 lg:col-span-8">
              <div className="flex items-baseline justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 bg-primary" />
                  <h2 className="font-bold font-headline text-lg text-on-surface uppercase tracking-wider">
                    Clasificación oficial
                  </h2>
                </div>
                <span className="font-mono text-on-surface-variant text-xs">
                  {classification.results.length} pilotos clasificados
                </span>
              </div>
              <ClassificationTable results={classification.results} />
            </section>
            <aside className="flex flex-col gap-6 lg:col-span-4">
              <PointsDistribution results={classification.results} />
            </aside>
          </div>
        </div>
      </div>
    )}
  </PageQueryView>
)
