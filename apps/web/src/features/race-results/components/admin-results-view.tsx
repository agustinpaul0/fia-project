import type { ReactNode } from 'react'
import { useSeasonSelection } from '../hooks/use-season-selection'
import { SeasonHero } from './season-hero'
import { RacesHeading, SeasonRaces } from './season-races-panel'
import { SeasonSelect } from './season-select'

export const AdminResultsView = ({ now = new Date() }: { readonly now?: Date }): ReactNode => {
  const { seasons, season, setSeason } = useSeasonSelection(now)
  return (
    <div className="flex w-full flex-col">
      <SeasonHero
        eyebrow="Panel de control FIA · Personal administrativo"
        title="Carga de resultados"
      >
        <SeasonSelect seasons={seasons} value={season} onChange={setSeason} />
      </SeasonHero>
      <div className="w-full px-6 py-10 lg:px-8">
        <div className="mx-auto flex max-w-3xl flex-col gap-4">
          <p className="border-primary border-l-4 pl-3 font-headline font-semibold text-on-surface-variant text-sm uppercase tracking-wide">
            Elegí una carrera para cargar o corregir su clasificación. Los puntos se calculan solos
            y las escuderías reciben la notificación al guardar.
          </p>
          <RacesHeading season={season} />
          <SeasonRaces scope={{ season, category: null }} target="admin" />
        </div>
      </div>
    </div>
  )
}
