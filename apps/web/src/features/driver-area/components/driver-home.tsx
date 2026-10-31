import type { DriverAccount } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { OfficialBadge } from '@/components/brand/official-badge'
import { PageQueryView } from '@/components/common/page-query-view'
import { QueryView } from '@/components/common/query-view'
import { useMyDriverAccount } from '@/features/driver-accounts/hooks/use-driver-accounts'
import { PenaltiesTable } from '@/features/penalties/components/penalties-table'
import { usePenalties } from '@/features/penalties/hooks/use-penalties'

const QUICK_LINKS = [
  { to: '/sanctions', label: 'Sanciones' },
  { to: '/scrutineering', label: 'Controles técnicos' },
  { to: '/chat', label: 'Mensajes' },
] as const

const DriverProfile = ({ account }: { readonly account: DriverAccount }): ReactNode => (
  <section className="flex flex-col gap-2 border-2 border-black bg-surface p-6 shadow-brutal">
    <div className="flex flex-wrap items-center gap-3">
      <h1 className="font-bold font-headline text-2xl uppercase">{account.driverName}</h1>
      <OfficialBadge label="Piloto oficial" />
    </div>
    <p className="font-mono text-on-surface-variant text-sm">
      {account.driverCode} · {account.teamName ?? 'Sin escudería'} · {account.email}
    </p>
    <nav aria-label="Accesos del piloto" className="mt-2 flex flex-wrap gap-2">
      {QUICK_LINKS.map((l) => (
        <Link
          key={l.to}
          to={l.to}
          className="border-2 border-black px-3 py-1 font-bold font-mono text-xs uppercase hover:bg-primary-container"
        >
          {l.label}
        </Link>
      ))}
    </nav>
  </section>
)

const MyPenalties = ({ driverId }: { readonly driverId: string }): ReactNode => (
  <section className="flex flex-col gap-3">
    <h2 className="font-bold font-headline text-lg uppercase">Mis sanciones</h2>
    <QueryView
      query={usePenalties({ driverId })}
      isEmpty={(items) => items.length === 0}
      emptyMessage="No tenés sanciones registradas en los últimos 5 años."
    >
      {(items) => <PenaltiesTable penalties={items} />}
    </QueryView>
  </section>
)

export const DriverHome = (): ReactNode => (
  <PageQueryView query={useMyDriverAccount()}>
    {(account) => (
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 py-8">
        <DriverProfile account={account} />
        <MyPenalties driverId={account.driverId} />
      </div>
    )}
  </PageQueryView>
)
