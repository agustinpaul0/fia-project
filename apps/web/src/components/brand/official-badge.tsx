import type { ReactNode } from 'react'

export const OfficialBadge = ({
  label = 'Cuenta Oficial FIA',
}: {
  readonly label?: string | undefined
}): ReactNode => (
  <span
    data-official-badge="true"
    className="inline-flex items-center gap-1 border border-black bg-primary-container px-2 py-0.5 font-bold font-mono text-[10px] text-black uppercase tracking-wider"
  >
    ✓ {label}
  </span>
)
