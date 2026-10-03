import type { TeamStaff } from '@fia/shared/contracts'
import { cn } from 'cn'
import type { ReactNode } from 'react'
import { teamColor } from '@/components/brand/team-color'
import { initialsOf } from '../staff-roster'

type Props = {
  readonly member: TeamStaff
  readonly onEdit: (member: TeamStaff) => void
  readonly onDeactivate: (member: TeamStaff) => void
}

const ACTION =
  'border-2 border-outline px-2.5 py-1 font-bold font-mono text-xs shadow-brutal-sm transition-transform hover:-translate-x-px hover:-translate-y-px disabled:pointer-events-none disabled:opacity-40'

const Status = ({ active }: { readonly active: boolean }): ReactNode => (
  <span
    className={cn(
      'inline-flex items-center gap-1 border-2 border-outline px-2 py-0.5 font-bold font-mono text-xs',
      active ? 'bg-[#dcfce7] text-fia-green' : 'bg-surface-container text-on-surface-variant',
    )}
  >
    <span
      className={cn('h-1.5 w-1.5 rounded-full', active ? 'bg-fia-green' : 'bg-on-surface-variant')}
    />
    {active ? 'Activo' : 'Inactivo'}
  </span>
)

export const TeamStaffRow = ({ member, onEdit, onDeactivate }: Props): ReactNode => (
  <tr className="transition-colors hover:bg-[#fffdeb]">
    <td className="px-4 py-4">
      <div className="flex items-center gap-2">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center border-2 border-outline bg-[#222222] font-bold font-mono text-fia-yellow text-xs">
          {initialsOf(member)}
        </span>
        <div className="flex flex-col">
          <span className="font-bold font-display text-base text-[#111827]">{`${member.firstName} ${member.lastName}`}</span>
          <span className="font-mono text-[11px] text-on-surface-variant">
            Legajo {member.fileNumber}
          </span>
        </div>
      </div>
    </td>
    <td className="px-4 py-4 font-mono text-[#374151] text-xs">{member.email}</td>
    <td className="px-4 py-4 font-mono text-[#374151] text-xs">{member.phoneNumber}</td>
    <td className="px-4 py-4">
      <span
        className={cn(
          'inline-flex items-center border px-2 py-0.5 font-bold text-xs',
          teamColor(member.teamName).chip,
        )}
      >
        {member.teamName}
      </span>
    </td>
    <td className="px-4 py-4 font-semibold text-[#1f2937]">{member.roleInTeam}</td>
    <td className="px-4 py-4 text-center">
      <Status active={member.isActive} />
    </td>
    <td className="px-4 py-4 text-right">
      <div className="inline-flex items-center gap-2">
        <button
          type="button"
          disabled={!member.isActive}
          onClick={() => onEdit(member)}
          className={cn(ACTION, 'bg-surface-container-lowest text-black hover:bg-fia-yellow')}
        >
          Editar
        </button>
        <button
          type="button"
          disabled={!member.isActive}
          onClick={() => onDeactivate(member)}
          className={cn(
            ACTION,
            'bg-surface-container-lowest text-[#e11d48] hover:bg-[#e11d48] hover:text-white',
          )}
        >
          Dar de baja
        </button>
      </div>
    </td>
  </tr>
)
