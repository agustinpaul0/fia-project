import type { ScoreNotification } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useConfirmNotification, useMyNotifications } from '../hooks/use-notifications'
import { NotificationCard } from './notification-card'

export const NO_PENDING_MESSAGE = 'No tenés notificaciones pendientes.'

const pendingLabel = (count: number): string =>
  count === 1 ? '1 notificación pendiente' : `${count} notificaciones pendientes`

const InboxHero = ({
  list,
}: {
  readonly list: readonly ScoreNotification[] | undefined
}): ReactNode => (
  <div className="flex flex-col gap-4 border-4 border-primary bg-surface-container-lowest p-6 shadow-[6px_6px_0px_0px_#1a1a1a] md:p-8">
    <div className="flex flex-wrap items-center justify-between gap-3 border-primary border-b-2 pb-3">
      <div className="flex items-center gap-2">
        <span className="inline-block h-3 w-3 bg-secondary" />
        <span className="font-bold font-headline text-on-surface-variant text-xs uppercase tracking-widest">
          Portal de enlace deportivo{list?.[0] === undefined ? '' : ` // ${list[0].teamName}`}
        </span>
      </div>
      <span className="bg-primary px-2.5 py-1 font-bold font-headline text-on-primary text-xs uppercase tracking-wider">
        Se actualiza cada 30 s
      </span>
    </div>
    <h1 className="font-bold font-headline text-4xl text-primary uppercase leading-none tracking-tighter sm:text-5xl md:text-6xl">
      Notificaciones
    </h1>
    <p className="max-w-2xl font-body font-medium text-on-surface-variant text-sm md:text-base">
      <span className="font-bold text-base text-secondary underline decoration-2 underline-offset-2">
        {pendingLabel(list?.length ?? 0)}
      </span>{' '}
      de confirmación de recepción del puntaje.
    </p>
  </div>
)

export const NotificationsInbox = (): ReactNode => {
  const confirm = useConfirmNotification()
  const query = useMyNotifications()
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 md:py-12 lg:px-8">
      <InboxHero list={query.data} />
      <QueryView
        query={query}
        isEmpty={(list) => list.length === 0}
        emptyMessage={NO_PENDING_MESSAGE}
      >
        {(list) => (
          <ul className="grid grid-cols-1 gap-6">
            {list.map((notification) => (
              <li key={notification.id}>
                <NotificationCard
                  notification={notification}
                  isConfirming={confirm.isPending && confirm.variables === notification.id}
                  onConfirm={() => confirm.mutate(notification.id)}
                />
              </li>
            ))}
          </ul>
        )}
      </QueryView>
    </div>
  )
}
