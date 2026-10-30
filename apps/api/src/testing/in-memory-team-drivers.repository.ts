import type { CreateTeamDriverBody, UpdateTeamDriverBody } from '@fia/shared/contracts'
import type { DriverRow } from '@fia/shared/db'
import type { TeamDriversRepository } from '../features/team-drivers/team-drivers.port'
import { createInMemoryDriverAccountsStore } from './in-memory-driver-accounts'

export type InMemoryTeamDriversRepository = TeamDriversRepository & {
  readonly items: DriverRow[]
}

const buildRow = (index: number, teamId: string, body: CreateTeamDriverBody): DriverRow => {
  const now = new Date()
  return {
    id: `00000000-0000-4000-8000-${String(index).padStart(12, '0')}`,
    firstName: body.firstName,
    lastName: body.lastName,
    code: body.code,
    number: body.number,
    country: body.country,
    license: body.license,
    teamId,
    categoryId: null,
    role: body.role,
    version: 1,
    createdAt: now,
    updatedAt: now,
  }
}

const applyUpdate = (
  drivers: DriverRow[],
  id: string,
  body: UpdateTeamDriverBody,
): DriverRow | null => {
  const index = drivers.findIndex((d) => d.id === id && d.version === body.version)
  const current = drivers[index]
  if (index === -1 || !current) {
    return null
  }
  const { version, ...fields } = body
  const updated: DriverRow = {
    ...current,
    ...fields,
    version: version + 1,
    updatedAt: new Date(),
  }
  drivers[index] = updated
  return updated
}

export const createInMemoryTeamDriversRepository = (
  initialDrivers: readonly DriverRow[] = [],
): InMemoryTeamDriversRepository => {
  const drivers: DriverRow[] = [...initialDrivers]
  return {
    ...createInMemoryDriverAccountsStore(),
    items: drivers,
    listAll: async () => [...drivers].sort((a, b) => a.number - b.number),
    listByTeam: async (teamId) =>
      drivers.filter((d) => d.teamId === teamId).sort((a, b) => a.number - b.number),
    findById: async (id) => drivers.find((d) => d.id === id) ?? null,
    findByNumber: async (_teamId, number) => drivers.find((d) => d.number === number) ?? null,
    findByCode: async (code) => drivers.find((d) => d.code === code) ?? null,
    countByTeamAndRole: async (teamId, role) =>
      drivers.filter((d) => d.teamId === teamId && d.role === role).length,
    create: async (teamId, body) => {
      const row = buildRow(drivers.length + 1, teamId, body)
      drivers.push(row)
      return row
    },
    update: async (id, body) => applyUpdate(drivers, id, body),
  }
}
