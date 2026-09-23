import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { useHealth } from '../hooks/use-health'

export const HealthBadge = (): ReactNode => {
  const health = useHealth()
  if (health.isPending) {
    return <Badge variant="outline">Verificando servidor…</Badge>
  }
  if (health.isError || health.data.database === 'down') {
    return <Badge variant="destructive">Servidor no disponible</Badge>
  }
  return <Badge variant="secondary">Servidor en línea</Badge>
}
