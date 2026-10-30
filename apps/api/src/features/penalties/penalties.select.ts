import { categories, drivers, penalties, races, teams } from '@fia/shared/db'

export const penaltySelectFields = {
  id: penalties.id,
  teamId: penalties.teamId,
  teamName: teams.name,
  categoryCode: categories.code,
  driverId: penalties.driverId,
  driverFirstName: drivers.firstName,
  driverLastName: drivers.lastName,
  raceId: penalties.raceId,
  raceName: races.name,
  type: penalties.type,
  penalty: penalties.penalty,
  reason: penalties.reason,
  issuedAt: penalties.issuedAt,
  confirmedAt: penalties.confirmedAt,
  confirmedByUserId: penalties.confirmedByUserId,
  version: penalties.version,
  createdAt: penalties.createdAt,
}
