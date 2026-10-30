import type { Driver } from '@fia/shared/contracts'
import type { ReactNode } from 'react'

const ROLE_LABELS: Record<string, string> = {
  main: 'Titular',
  reserve: 'Suplente',
}

export const TeamDriverRow = ({
  driver,
  onEdit,
}: {
  readonly driver: Driver
  readonly onEdit?: ((driver: Driver) => void) | undefined
}): ReactNode => (
  <tr className="transition-colors hover:bg-surface-container-high/40">
    <td className="px-4 py-3 font-bold font-mono text-base">
      <span className="inline-block border border-black bg-yellow-400 px-2 py-0.5 text-black">
        #{driver.number}
      </span>
    </td>
    <td className="px-4 py-3 font-bold text-on-surface">
      {driver.firstName} {driver.lastName}
    </td>
    <td className="px-4 py-3 font-bold font-mono text-secondary text-sm">{driver.code}</td>
    <td className="px-4 py-3 text-on-surface-variant text-sm">{driver.country}</td>
    <td className="px-4 py-3 font-mono text-on-surface-variant text-sm">{driver.license ?? '—'}</td>
    <td className="px-4 py-3">
      <span
        className={`inline-block border px-2 py-0.5 font-bold font-mono text-xs uppercase ${
          driver.role === 'main'
            ? 'border-green-600 bg-green-100 text-green-900'
            : 'border-blue-600 bg-blue-100 text-blue-900'
        }`}
      >
        {ROLE_LABELS[driver.role] ?? driver.role}
      </span>
    </td>
    {onEdit ? (
      <td className="px-4 py-3">
        <button
          type="button"
          onClick={() => onEdit(driver)}
          className="border border-black bg-white px-2.5 py-1 font-bold font-mono text-xs uppercase hover:bg-primary-container"
        >
          Editar
        </button>
      </td>
    ) : null}
  </tr>
)
