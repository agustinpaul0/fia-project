import type { TeamStaff } from '@fia/shared/contracts'
import { AppError } from '@fia/shared/domain'
import type {
  CreateTeamStaffRecord,
  DeactivateTeamStaffRecord,
  TeamStaffRepository,
  UpdateTeamStaffRecord,
} from '../features/team-staff/team-staff.port'
import type { FakeAccount } from './in-memory-team-staff-accounts'
import { buildCreatedStaffRecord } from './team-staff-builders'

const createStaffQueries = (
  items: Map<string, TeamStaff>,
  withEmail: (item: TeamStaff) => TeamStaff,
) => ({
  findAll: async () =>
    [...items.values()]
      .map(withEmail)
      .sort(
        (a, b) =>
          a.lastName.localeCompare(b.lastName) ||
          a.firstName.localeCompare(b.firstName) ||
          a.id.localeCompare(b.id),
      ),
  findById: async (id: string) => {
    const it = items.get(id)
    return it ? withEmail(it) : null
  },
  findByFileNumber: async (fn: string) => {
    const f = [...items.values()].find((i) => i.fileNumber === fn)
    return f ? withEmail(f) : null
  },
  findByUserId: async (uid: string) => {
    const f = [...items.values()].find((i) => i.userId === uid)
    return f ? withEmail(f) : null
  },
})

const createStaffMutations = (
  items: Map<string, TeamStaff>,
  withEmail: (item: TeamStaff) => TeamStaff,
  accountsMap?: Map<string, FakeAccount>,
) => ({
  create: async (input: CreateTeamStaffRecord) => {
    if ([...items.values()].some((i) => i.fileNumber === input.fileNumber)) {
      throw new AppError('STAFF_FILE_NUMBER_ALREADY_EXISTS')
    }
    const email = accountsMap?.get(input.userId)?.email ?? ''
    const created = buildCreatedStaffRecord(input, email, items.size)
    items.set(created.id, created)
    return created
  },
  update: async (id: string, input: UpdateTeamStaffRecord) => {
    const cur = items.get(id)
    if (!cur || cur.version !== input.version) {
      return null
    }
    const updated: TeamStaff = {
      ...cur,
      ...input,
      version: cur.version + 1,
      updatedAt: new Date().toISOString(),
    }
    items.set(id, updated)
    return withEmail(updated)
  },
  deactivate: async (id: string, input: DeactivateTeamStaffRecord) => {
    const cur = items.get(id)
    if (!cur || cur.version !== input.version) {
      return null
    }
    const deactivated: TeamStaff = {
      ...cur,
      isActive: false,
      deactivatedAt: input.deactivatedAt.toISOString(),
      version: cur.version + 1,
      updatedAt: new Date().toISOString(),
    }
    items.set(id, deactivated)
    return withEmail(deactivated)
  },
})

export const createInMemoryTeamStaffRepository = (
  initialItems: readonly TeamStaff[] = [],
  accountsMap?: Map<string, FakeAccount>,
): TeamStaffRepository & { readonly items: Map<string, TeamStaff> } => {
  const items = new Map<string, TeamStaff>(initialItems.map((i) => [i.id, { ...i }]))
  const withEmail = (item: TeamStaff): TeamStaff => ({
    ...item,
    email: accountsMap?.get(item.userId)?.email ?? item.email,
  })

  return {
    items,
    ...createStaffQueries(items, withEmail),
    ...createStaffMutations(items, withEmail, accountsMap),
  }
}
