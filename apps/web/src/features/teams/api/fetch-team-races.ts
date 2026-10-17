import {
  type TeamRaceOption,
  teamRaceOptionListSchema,
  teamRaceOptionsPath,
} from '@fia/shared/contracts'
import { apiRequest } from '@/lib/api/http-client'

export const fetchTeamRaces = (
  teamId: string,
  season: number,
): Promise<readonly TeamRaceOption[]> =>
  apiRequest({ path: teamRaceOptionsPath(teamId, season), schema: teamRaceOptionListSchema })
