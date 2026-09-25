import type { TeamOption } from '@fia/shared/contracts'

export type TeamsRepository = {
  readonly findAllOptions: () => Promise<readonly TeamOption[]>
  readonly exists: (id: string) => Promise<boolean>
}
