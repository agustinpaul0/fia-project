import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { ClassificationEditor } from '../editor/classification-editor'
import { useRaceClassification, useRaceDrivers } from '../hooks/use-race-queries'
import { RaceHeader } from './race-header'

export const RACE_NOT_RUN_MESSAGE =
  'Esta carrera todavía no se corrió: vas a poder cargar el resultado cuando haya terminado.'

type Props = {
  readonly raceId: string
  readonly now?: Date
}

export const AdminRaceEditor = ({ raceId, now = new Date() }: Props): ReactNode => {
  const drivers = useRaceDrivers(raceId)
  return (
    <QueryView query={useRaceClassification(raceId)} isEmpty={() => false} emptyMessage="">
      {(classification) => (
        <section className="flex flex-col gap-4">
          <RaceHeader race={classification.race} />
          {new Date(classification.race.date) > now ? (
            <Alert>
              <AlertDescription>{RACE_NOT_RUN_MESSAGE}</AlertDescription>
            </Alert>
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
        </section>
      )}
    </QueryView>
  )
}
