import type { ReactNode } from 'react'
import { PageQueryView } from '@/components/common/page-query-view'
import { QueryView } from '@/components/common/query-view'
import { ClassificationEditor } from '../editor/classification-editor'
import { useRaceClassification, useRaceDrivers } from '../hooks/use-race-queries'
import { AdminRaceHero } from './admin-race-hero'
import { AdminRaceTicker } from './admin-race-ticker'

export const RACE_NOT_RUN_MESSAGE =
  'Esta carrera todavía no se corrió: vas a poder cargar el resultado cuando haya terminado.'

type Props = {
  readonly raceId: string
  readonly now?: Date
}

const NotRunYet = (): ReactNode => (
  <p className="border-2 border-primary border-dashed bg-surface-container-low px-6 py-8 text-center font-headline font-semibold text-on-surface-variant text-sm uppercase tracking-wide">
    {RACE_NOT_RUN_MESSAGE}
  </p>
)

export const AdminRaceEditor = ({ raceId, now = new Date() }: Props): ReactNode => {
  const drivers = useRaceDrivers(raceId)
  return (
    <PageQueryView query={useRaceClassification(raceId)}>
      {(classification) => (
        <div className="flex w-full flex-col">
          <AdminRaceTicker race={classification.race} />
          <div className="mx-auto w-full max-w-7xl space-y-6 p-4 sm:p-8">
            <AdminRaceHero race={classification.race} />
            {new Date(classification.race.date) > now ? (
              <NotRunYet />
            ) : (
              <QueryView
                query={drivers}
                isEmpty={(list) => list.length === 0}
                emptyMessage="No hay pilotos inscriptos en la categoría de esta carrera."
              >
                {(list) => (
                  <ClassificationEditor
                    key={classification.race.version}
                    classification={classification}
                    drivers={list}
                  />
                )}
              </QueryView>
            )}
          </div>
        </div>
      )}
    </PageQueryView>
  )
}
