import type { TeamStaff } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

type Props = {
  readonly members: readonly TeamStaff[]
  readonly onEdit: (member: TeamStaff) => void
  readonly onDeactivate: (member: TeamStaff) => void
}

export const TeamStaffTable = ({ members, onEdit, onDeactivate }: Props): ReactNode => {
  if (members.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay personal de escuderías cargado.
      </p>
    )
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-left text-sm">
        <thead className="border-b bg-muted/50 text-xs font-medium text-muted-foreground">
          <tr>
            <th className="p-3">Miembro</th>
            <th className="p-3">Escudería</th>
            <th className="p-3">Cargo</th>
            <th className="p-3">Email</th>
            <th className="p-3">Teléfono</th>
            <th className="p-3">Legajo</th>
            <th className="p-3">Estado</th>
            <th className="p-3 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {members.map((m) => (
            <tr key={m.id} className="hover:bg-muted/30">
              <td className="p-3 font-medium">{`${m.lastName}, ${m.firstName}`}</td>
              <td className="p-3">{m.teamName}</td>
              <td className="p-3">{m.roleInTeam}</td>
              <td className="p-3">{m.email}</td>
              <td className="p-3">{m.phoneNumber}</td>
              <td className="p-3">{m.fileNumber}</td>
              <td className="p-3">
                {m.isActive ? (
                  <Badge variant="secondary">Activo</Badge>
                ) : (
                  <Badge variant="outline">Inactivo</Badge>
                )}
              </td>
              <td className="p-3 text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={!m.isActive}
                    onClick={() => onEdit(m)}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    disabled={!m.isActive}
                    onClick={() => onDeactivate(m)}
                  >
                    Dar de baja
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
