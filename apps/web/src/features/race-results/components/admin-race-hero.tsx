import type { RaceSummary } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { formatDateTime, formatNumericDate } from '@/lib/format-date-time'
import { circuitWatermark } from '../season/season-summary'
import { RACE_TYPE_LABELS } from './race-type-badge'

const Stat = ({
  label,
  value,
  accent = false,
}: {
  readonly label: string
  readonly value: string
  readonly accent?: boolean
}): ReactNode => (
  <div className="border-primary pr-3 not-last:border-r-2">
    <div className="font-bold text-[10px] text-on-surface-variant">{label}</div>
    <div
      className={`font-bold text-lg leading-tight ${accent ? 'text-secondary' : 'text-primary'}`}
    >
      {value}
    </div>
  </div>
)

export const AdminRaceHero = ({ race }: { readonly race: RaceSummary }): ReactNode => (
  <section className="relative overflow-hidden border-2 border-primary bg-surface-container-lowest p-6 shadow-[6px_6px_0px_0px_#1a1a1a] sm:p-8">
    <div className="pointer-events-none absolute -right-8 -bottom-10 select-none font-bold font-headline text-8xl text-primary uppercase leading-none opacity-10">
      {circuitWatermark(race.circuitName)}
    </div>
    <div className="relative z-10 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
      <div className="max-w-3xl space-y-3">
        <div className="flex flex-wrap items-center gap-2 font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
          <span>
            {RACE_TYPE_LABELS[race.type]} · Ronda {String(race.round).padStart(2, '0')}
          </span>
          <span>•</span>
          <span className="font-black text-secondary">{race.circuitName}</span>
        </div>
        <h1 className="font-bold font-headline text-2xl text-primary uppercase leading-none tracking-tight sm:text-4xl lg:text-5xl">
          {race.name}
        </h1>
        <p className="border-primary border-l-4 pl-3 font-headline font-semibold text-on-surface-variant text-sm uppercase tracking-wide sm:text-base">
          Asignación de puntaje oficial por orden de llegada
        </p>
      </div>
      <div className="grid shrink-0 grid-cols-2 gap-3 border-2 border-primary bg-surface-container p-3 font-headline uppercase sm:grid-cols-3">
        <Stat label="Categoría" value={race.categoryCode} />
        <Stat label="Temporada" value={String(race.seasonYear)} />
        <Stat
          label="Fecha (hora arg.)"
          value={`${formatNumericDate(race.date)} · ${formatDateTime(race.date).split(', ')[1] ?? ''}`}
          accent
        />
      </div>
    </div>
  </section>
)
