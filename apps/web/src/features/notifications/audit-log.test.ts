import { describe, expect, it } from 'vitest'
import { aScoreNotification } from '@/testing/notification-builders'
import { ALL_AUDIT, auditStats, filterAudit } from './audit-log'

const bahrain = aScoreNotification({
  id: 'a',
  raceName: 'Gran Premio de Bahréin',
  teamName: 'Ferrari',
  status: 'confirmed',
})
const monaco = aScoreNotification({
  id: 'b',
  raceName: 'Gran Premio de Mónaco',
  teamName: 'McLaren',
  status: 'pending',
})
const sprint = aScoreNotification({
  id: 'c',
  raceName: 'Sprint de Miami',
  teamName: 'Ferrari',
  status: 'confirmed',
})
const all = [bahrain, monaco, sprint]

describe('registro de confirmaciones', () => {
  it('sin filtros devuelve todo', () => {
    expect(filterAudit(all, ALL_AUDIT)).toEqual(all)
  })

  it('filtra por estado', () => {
    expect(filterAudit(all, { text: '', status: 'pending' })).toEqual([monaco])
    expect(filterAudit(all, { text: '', status: 'confirmed' })).toEqual([bahrain, sprint])
  })

  it('busca por carrera o escudería sin tildes y combina con el estado', () => {
    expect(filterAudit(all, { text: 'monaco', status: 'all' })).toEqual([monaco])
    expect(filterAudit(all, { text: 'FERRARI', status: 'all' })).toEqual([bahrain, sprint])
    expect(filterAudit(all, { text: 'ferrari', status: 'pending' })).toEqual([])
  })

  it('calcula totales y porcentajes redondeados', () => {
    expect(auditStats(all)).toEqual({
      total: 3,
      confirmed: 2,
      pending: 1,
      confirmedPct: 67,
      pendingPct: 33,
    })
    expect(auditStats([])).toEqual({
      total: 0,
      confirmed: 0,
      pending: 0,
      confirmedPct: 0,
      pendingPct: 0,
    })
  })
})
