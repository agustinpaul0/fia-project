import type { RaceSummary } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'

const TAG =
  'border-2 border-primary px-2 py-0.5 font-bold font-headline text-[11px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#1a1a1a]'

export const publicationLabel = (revision: number): string =>
  revision === 0 ? 'Sin publicar desde el sistema' : `Revisión ${revision} publicada`

export const AdminRaceTicker = ({ race }: { readonly race: RaceSummary }): ReactNode => (
  <div className="flex flex-wrap items-center justify-between gap-3 border-primary border-b-2 bg-surface-container-high px-4 py-2.5 sm:px-8">
    <div className="flex flex-wrap items-center gap-2 font-bold font-headline text-primary text-xs uppercase tracking-wider">
      <Link to="/admin/results" className="flex items-center gap-1.5 hover:text-secondary">
        <ArrowLeft className="size-3.5" aria-hidden />
        Carga de resultados
      </Link>
      <span className="text-on-surface-variant">{'//'}</span>
      <span className="text-on-surface-variant">Temporada {race.seasonYear}</span>
      <span className="text-on-surface-variant">{'//'}</span>
      <span className="bg-primary px-1.5 py-0.5 text-on-primary">
        {race.categoryCode} - R{String(race.round).padStart(2, '0')}
      </span>
    </div>
    <div className="flex flex-wrap items-center gap-2">
      <span className={`${TAG} bg-primary-container text-on-primary-container`}>
        Modo edición activo
      </span>
      <span className={`${TAG} bg-surface-container-lowest text-secondary`}>
        {publicationLabel(race.resultsRevision)}
      </span>
    </div>
  </div>
)
