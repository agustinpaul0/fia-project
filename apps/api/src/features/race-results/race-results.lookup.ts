import { AppError } from '@fia/shared/domain'
import type { RaceHeader, RaceResultsRepository } from './race-results.port'

export const findOrFail = async (repo: RaceResultsRepository, id: string): Promise<RaceHeader> => {
  const race = await repo.findRace(id)
  if (!race) {
    throw new AppError('RACE_NOT_FOUND')
  }
  return race
}

export const findActiveOrFail = async (
  repo: RaceResultsRepository,
  id: string,
): Promise<RaceHeader> => {
  const race = await findOrFail(repo, id)
  if (race.status === 'cancelled') {
    throw new AppError('RACE_ALREADY_CANCELLED')
  }
  return race
}
