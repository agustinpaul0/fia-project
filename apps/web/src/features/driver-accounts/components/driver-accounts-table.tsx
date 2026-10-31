import type { DriverAccount } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { OfficialBadge } from '@/components/brand/official-badge'
import { Button } from '@/components/ui/button'

type Props = {
  readonly accounts: readonly DriverAccount[]
  readonly onEdit: (account: DriverAccount) => void
  readonly onDeactivate: (account: DriverAccount) => void
}

const StatusCell = ({ active }: { readonly active: boolean }): ReactNode => (
  <span
    className={`border px-2 py-0.5 font-bold font-mono text-[11px] uppercase ${
      active ? 'border-green-700 bg-green-100 text-green-900' : 'border-outline bg-surface-dim'
    }`}
  >
    {active ? 'Activa' : 'Inactiva'}
  </span>
)

const AccountRow = ({
  account,
  onEdit,
  onDeactivate,
}: Omit<Props, 'accounts'> & {
  readonly account: DriverAccount
}): ReactNode => (
  <tr className="border-outline border-b">
    <td className="px-4 py-3">
      <div className="font-bold font-headline text-sm">{account.driverName}</div>
      <div className="font-mono text-on-surface-variant text-xs">
        {account.driverCode} · {account.teamName ?? 'Sin escudería'}
      </div>
    </td>
    <td className="px-4 py-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm">{account.name}</span>
        <OfficialBadge label="Piloto oficial" />
      </div>
      <div className="font-mono text-on-surface-variant text-xs">{account.email}</div>
    </td>
    <td className="px-4 py-3">
      <StatusCell active={account.isActive} />
    </td>
    <td className="px-4 py-3 text-right">
      {account.isActive ? (
        <div className="flex justify-end gap-2">
          <Button size="sm" variant="outline" onClick={() => onEdit(account)}>
            Editar
          </Button>
          <Button size="sm" variant="danger" onClick={() => onDeactivate(account)}>
            Dar de baja
          </Button>
        </div>
      ) : null}
    </td>
  </tr>
)

export const DriverAccountsTable = ({ accounts, ...actions }: Props): ReactNode => (
  <div className="overflow-x-auto border-2 border-black bg-surface shadow-brutal">
    <table className="w-full text-left">
      <thead className="bg-surface-container font-bold font-mono text-xs uppercase">
        <tr>
          <th className="px-4 py-3">Piloto</th>
          <th className="px-4 py-3">Cuenta</th>
          <th className="px-4 py-3">Estado</th>
          <th className="px-4 py-3 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {accounts.map((account) => (
          <AccountRow key={account.id} account={account} {...actions} />
        ))}
      </tbody>
    </table>
  </div>
)
