import { describe, expect, it } from 'vitest'
import { aTeamStaffMember } from '@/testing/team-staff-builders'
import { EMPTY_FILTER, filterStaff, initialsOf, staffStats } from './staff-roster'

const MCLAREN = '00000000-0000-4000-8000-000000000020'
const leclerc = aTeamStaffMember()
const norris = aTeamStaffMember({
  id: 'n',
  firstName: 'Lando',
  lastName: 'Norris',
  email: 'lando@mclaren.com',
  teamId: MCLAREN,
  teamName: 'McLaren',
  fileNumber: 'MCL-4',
})
const inactive = aTeamStaffMember({
  id: 'x',
  firstName: 'Óscar',
  lastName: 'Piastri',
  email: 'oscar@mclaren.com',
  teamId: MCLAREN,
  isActive: false,
})
const all = [leclerc, norris, inactive]

describe('listado de personal', () => {
  it('sin filtros devuelve a todos', () => {
    expect(filterStaff(all, EMPTY_FILTER)).toEqual(all)
  })

  it('busca por nombre, email, escudería o legajo sin importar tildes ni mayúsculas', () => {
    expect(filterStaff(all, { text: 'oscar', teamId: '' })).toEqual([inactive])
    expect(filterStaff(all, { text: 'LANDO@', teamId: '' })).toEqual([norris])
    expect(filterStaff(all, { text: 'ferrari', teamId: '' })).toEqual([leclerc, inactive])
    expect(filterStaff(all, { text: 'mcl-4', teamId: '' })).toEqual([norris])
    expect(filterStaff(all, { text: '  ', teamId: '' })).toEqual(all)
  })

  it('filtra por escudería y combina con el texto', () => {
    expect(filterStaff(all, { text: '', teamId: MCLAREN })).toEqual([norris, inactive])
    expect(filterStaff(all, { text: 'lando', teamId: MCLAREN })).toEqual([norris])
    expect(filterStaff(all, { text: 'charles', teamId: MCLAREN })).toEqual([])
  })

  it('cuenta sólo las cuentas activas y sus escuderías', () => {
    expect(staffStats(all)).toEqual({ active: 2, linkedTeams: 2 })
    expect(staffStats([inactive])).toEqual({ active: 0, linkedTeams: 0 })
  })

  it('arma las iniciales en mayúsculas', () => {
    expect(initialsOf({ firstName: ' toto', lastName: 'wolff' })).toBe('TW')
  })
})
