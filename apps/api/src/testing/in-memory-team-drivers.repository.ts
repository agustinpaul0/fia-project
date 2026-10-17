import type { DriverRow } from '@fia/shared/db'
import type { TeamDriversRepository } from '../features/team-drivers/team-drivers.port'

export type InMemoryTeamDriversRepository = TeamDriversRepository & {
  readonly items: DriverRow[]
}

export const createInMemoryTeamDriversRepository = (
  initialDrivers: readonly DriverRow[] = [],
): InMemoryTeamDriversRepository => {
  const drivers: DriverRow[] = [...initialDrivers]

  return {
    items: drivers,
    listByTeam: async (teamId) =>
      drivers.filter((d) => d.teamId === teamId).sort((a, b) => a.number - b.number),
    findByNumber: async (_teamId, number) => drivers.find((d) => d.number === number) ?? null,
    findByCode: async (code) => drivers.find((d) => d.code === code) ?? null,
    countByTeamAndRole: async (teamId, role) =>
      drivers.filter((d) => d.teamId === teamId && d.role === role).length,
    create: async (teamId, body) => {
      const now = new Date()
      const row: DriverRow = {
        id: `00000000-0000-4000-8000-${String(drivers.length + 1).padStart(12, '0')}`,
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
      drivers.push(row)
      return row
    },
  }
}
