import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useRaceClassification } from '../hooks/use-race-queries'
import { ClassificationTable } from './classification-table'
import { RaceHeader } from './race-header'

export const RaceClassificationView = ({ raceId }: { readonly raceId: string }): ReactNode => (
  <section className="flex flex-col gap-4">
    <QueryView query={useRaceClassification(raceId)} isEmpty={() => false} emptyMessage="">
      {(classification) => (
        <>
          <RaceHeader race={classification.race} />
          <ClassificationTable results={classification.results} />
        </>
      )}
    </QueryView>
  </section>
)
