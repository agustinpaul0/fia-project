import { ShieldCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import type { AuditStats } from '../audit-log'

const StatBox = ({
  label,
  value,
  note,
  tone,
}: {
  readonly label: string
  readonly value: string
  readonly note: string
  readonly tone: { readonly box: string; readonly label: string; readonly value: string }
}): ReactNode => (
  <div
    className={`flex flex-col justify-between border-2 border-primary p-3 shadow-[3px_3px_0px_0px_#1a1a1a] ${tone.box}`}
  >
    <span className={`font-bold font-headline text-[10px] uppercase tracking-wider ${tone.label}`}>
      {label}
    </span>
    <div className="mt-1 flex items-baseline gap-1">
      <span className={`font-bold font-headline text-2xl ${tone.value}`}>{value}</span>
      <span className={`font-bold font-headline text-[10px] ${tone.value}`}>{note}</span>
    </div>
  </div>
)

const NEUTRAL = {
  box: 'bg-surface-container-lowest',
  label: 'text-on-surface-variant',
  value: 'text-primary',
}
const GREEN = { box: 'bg-[#e8f7ee]', label: 'text-[#0e6231]', value: 'text-[#0e6231]' }
const YELLOW = { box: 'bg-[#fff4cc]', label: 'text-[#7a5900]', value: 'text-secondary' }

export const AuditHero = ({ stats }: { readonly stats: AuditStats | null }): ReactNode => (
  <header className="flex flex-col justify-between gap-6 pb-2 lg:flex-row lg:items-end">
    <div className="max-w-3xl space-y-2">
      <div className="inline-flex items-center gap-2 font-bold font-headline text-secondary text-xs uppercase tracking-widest">
        <ShieldCheck className="size-4" aria-hidden />
        Panel de control y fiscalización
      </div>
      <h1 className="font-bold font-headline text-3xl text-primary uppercase leading-none tracking-tight sm:text-4xl md:text-5xl">
        Confirmaciones de puntajes
      </h1>
      <p className="max-w-2xl font-body font-medium text-on-surface-variant text-sm md:text-base">
        Quién confirmó cada puntaje publicado y cuándo (hora argentina).
      </p>
    </div>
    <div className="grid shrink-0 grid-cols-3 gap-2 sm:gap-3">
      <StatBox label="Total" value={String(stats?.total ?? '—')} note="regs" tone={NEUTRAL} />
      <StatBox
        label="Confirmadas"
        value={String(stats?.confirmed ?? '—')}
        note={`${stats?.confirmedPct ?? 0}%`}
        tone={GREEN}
      />
      <StatBox
        label="Pendientes"
        value={String(stats?.pending ?? '—')}
        note={`${stats?.pendingPct ?? 0}%`}
        tone={YELLOW}
      />
    </div>
  </header>
)
