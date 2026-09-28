import type { ScoreNotification } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RaceTypeBadge } from '@/features/race-results/components/race-type-badge'
import { formatDate } from '@/lib/format-date-time'

type Props = {
  readonly notification: ScoreNotification
  readonly isConfirming: boolean
  readonly onConfirm: () => void
}

export const revisionLabel = (revision: number): string =>
  revision === 1 ? 'Puntaje publicado' : `Puntaje corregido (revisión ${revision})`

export const NotificationCard = ({ notification, isConfirming, onConfirm }: Props): ReactNode => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between gap-2">
      <CardTitle className="text-base">{notification.raceName}</CardTitle>
      <RaceTypeBadge type={notification.raceType} />
    </CardHeader>
    <CardContent className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm">
        <p className="font-medium">{revisionLabel(notification.resultsRevision)}</p>
        <p className="text-muted-foreground">
          {notification.teamName} sumó {notification.teamPoints} puntos ·{' '}
          {formatDate(notification.raceDate)}
        </p>
      </div>
      <Button onClick={onConfirm} disabled={isConfirming}>
        {isConfirming ? 'Confirmando...' : 'Confirmar recepción'}
      </Button>
    </CardContent>
  </Card>
)
