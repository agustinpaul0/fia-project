import type { ScoreNotification } from '@fia/shared/contracts'
import { Clock, ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { RaceTypeBadge } from '@/features/race-results/components/race-type-badge'
import { formatDateTime, formatNumericDate } from '@/lib/format-date-time'
import { revisionLabel } from './revision-label'

type Props = {
  readonly notification: ScoreNotification
  readonly isConfirming: boolean
  readonly onConfirm: () => void
}

const RevisionTag = ({ revision }: { readonly revision: number }): ReactNode =>
  revision === 1 ? (
    <span className="bg-primary px-2.5 py-1 font-bold font-headline text-on-primary text-xs uppercase tracking-wider">
      {revisionLabel(revision)}
    </span>
  ) : (
    <span className="border-2 border-primary bg-secondary px-2.5 py-1 font-bold font-headline text-on-primary text-xs uppercase tracking-wider">
      {revisionLabel(revision)}
    </span>
  )

export const NotificationCard = ({ notification, isConfirming, onConfirm }: Props): ReactNode => (
  <article className="border-4 border-primary bg-surface-container-lowest shadow-[6px_6px_0px_0px_#1a1a1a]">
    <header className="flex flex-wrap items-center justify-between gap-3 border-primary border-b-2 bg-surface-container-high px-5 py-3">
      <div className="flex items-center gap-3">
        <RaceTypeBadge
          type={notification.raceType}
          className="border-2 border-primary px-2.5 text-xs shadow-[2px_2px_0px_0px_#1a1a1a]"
        />
        <h2 className="font-bold font-headline text-lg text-primary uppercase tracking-tight sm:text-xl">
          {notification.raceName}
        </h2>
      </div>
      <div className="flex items-center gap-2 font-headline font-semibold text-on-surface-variant text-xs">
        <Clock className="size-4" aria-hidden />
        <span>Publicado {formatDateTime(notification.createdAt)} (hora arg.)</span>
      </div>
    </header>
    <div className="flex flex-col justify-between gap-6 p-6 md:p-8 lg:flex-row lg:items-center">
      <div className="flex max-w-3xl flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2.5">
          <RevisionTag revision={notification.resultsRevision} />
          <span className="flex items-center gap-1 font-headline font-semibold text-secondary text-xs uppercase tracking-wider">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-secondary" />{' '}
            Requiere tu confirmación
          </span>
        </div>
        <p className="font-bold font-headline text-primary text-xl uppercase tracking-tight sm:text-2xl">
          {notification.teamName} sumó {notification.teamPoints} puntos ·{' '}
          {formatNumericDate(notification.raceDate)}
        </p>
        <p className="font-body text-on-surface-variant text-sm leading-relaxed">
          Temporada {notification.seasonYear}. Confirmá con un click que tu escudería recibió el
          puntaje publicado por la FIA; la confirmación queda registrada con tu nombre y la hora.
        </p>
      </div>
      <div className="flex min-w-[220px] shrink-0 flex-col gap-2">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isConfirming}
          className="flex w-full items-center justify-center gap-2 border-[3px] border-primary bg-primary px-5 py-3 font-bold font-headline text-on-primary text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#1a1a1a] transition-colors hover:bg-primary-container hover:text-on-primary-container active:translate-x-0.5 active:translate-y-0.5 active:shadow-none disabled:opacity-60"
        >
          <ShieldCheck className="size-[18px]" aria-hidden />
          <span>{isConfirming ? 'Confirmando...' : 'Confirmar recepción'}</span>
        </button>
      </div>
    </div>
  </article>
)
