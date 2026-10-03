import { Plus } from 'lucide-react'
import type { ReactNode } from 'react'
import type { StaffStats } from '../staff-roster'

type Props = {
  readonly stats: StaffStats | null
  readonly onCreate: () => void
}

const Stat = ({
  label,
  value,
  tone,
}: {
  readonly label: string
  readonly value: string
  readonly tone: string
}): ReactNode => (
  <div className="flex items-center justify-between border-2 border-outline bg-surface p-3">
    <span className="font-bold font-mono text-[#4a4a4a] text-xs uppercase tracking-wide">
      {label}
    </span>
    <span
      className={`border-2 border-outline px-2.5 py-0.5 font-bold font-display text-lg text-fia-black ${tone}`}
    >
      {value}
    </span>
  </div>
)

export const TeamStaffHero = ({ stats, onCreate }: Props): ReactNode => (
  <section className="mb-8 border-2 border-outline bg-surface-container-lowest p-6 shadow-brutal md:p-8">
    <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
      <div>
        <div className="mb-3 inline-flex items-center gap-2 bg-fia-black px-2.5 py-1 font-bold font-mono text-fia-yellow text-xs uppercase tracking-wider">
          <span>FIA Paddock Control</span>
          <span>/</span>
          <span>Cuentas de escuderías</span>
        </div>
        <h1 className="font-display font-extrabold text-3xl text-fia-black tracking-tight sm:text-4xl">
          Personal de escuderías
        </h1>
        <p className="mt-2 max-w-3xl text-[#374151] text-base leading-relaxed">
          Gestión de cuentas para el personal de las escuderías participantes: alta, modificación y
          baja de los accesos al sistema.
        </p>
      </div>
      <button
        type="button"
        onClick={onCreate}
        className="inline-flex w-full shrink-0 items-center justify-center gap-2 border-2 border-outline bg-fia-yellow px-6 py-3.5 font-bold font-display text-base text-fia-black shadow-brutal transition-transform hover:-translate-x-px hover:-translate-y-px hover:bg-[#facc15] active:translate-x-0.5 active:translate-y-0.5 active:shadow-brutal-sm sm:w-auto"
      >
        <Plus className="size-5" strokeWidth={2.5} aria-hidden />
        <span>Nuevo integrante</span>
      </button>
    </div>
    <div className="mt-8 grid grid-cols-1 gap-4 border-outline border-t-2 pt-6 md:grid-cols-2">
      <Stat
        label="Integrantes activos:"
        value={stats === null ? '—' : String(stats.active)}
        tone="bg-fia-yellow"
      />
      <Stat
        label="Escuderías vinculadas:"
        value={stats === null ? '—' : String(stats.linkedTeams)}
        tone="bg-surface-container-lowest"
      />
    </div>
  </section>
)
