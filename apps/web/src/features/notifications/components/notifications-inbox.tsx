import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useConfirmNotification, useMyNotifications } from '../hooks/use-notifications'
import { NotificationCard } from './notification-card'

export const NO_PENDING_MESSAGE = 'No tenés notificaciones pendientes.'

export const NotificationsInbox = (): ReactNode => {
  const confirm = useConfirmNotification()
  return (
    <section className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">Notificaciones</h2>
      <QueryView
        query={useMyNotifications()}
        isEmpty={(list) => list.length === 0}
        emptyMessage={NO_PENDING_MESSAGE}
      >
        {(list) => (
          <ul className="flex flex-col gap-3">
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
    </section>
  )
}
