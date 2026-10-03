import type { ReactNode } from 'react'
import { useHealth } from '../hooks/use-health'

export const API_DOWN_MESSAGE = 'API no disponible'

export const HealthBadge = (): ReactNode => {
  const health = useHealth()
  if (!health.isError && health.data?.database !== 'down') {
    return null
  }
  return (
    <div
      role="alert"
      className="flex items-center gap-2 border-2 border-secondary bg-secondary/15 px-3 py-1"
    >
      <span className="h-2 w-2 rounded-full bg-secondary" />
      <span className="whitespace-nowrap font-bold font-label text-[11px] text-secondary uppercase tracking-wider">
        {API_DOWN_MESSAGE}
      </span>
    </div>
  )
}
