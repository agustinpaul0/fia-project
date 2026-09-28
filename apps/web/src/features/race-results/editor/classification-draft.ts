export type DraftRow = {
  readonly key: string
  readonly driverId: string
}

export type DraftRows = readonly DraftRow[]

export const EMPTY_SLOT = ''

export const toDraftRows = (driverIds: readonly string[]): DraftRows =>
  driverIds.map((driverId) => ({ key: driverId, driverId }))

export const addRow = (rows: DraftRows, key: string): DraftRows => [
  ...rows,
  { key, driverId: EMPTY_SLOT },
]

export const removeRow = (rows: DraftRows, index: number): DraftRows =>
  rows.filter((_, position) => position !== index)

export const setRow = (rows: DraftRows, change: { index: number; driverId: string }): DraftRows =>
  rows.map((row, position) =>
    position === change.index ? { ...row, driverId: change.driverId } : row,
  )

export const moveRow = (rows: DraftRows, move: { index: number; offset: -1 | 1 }): DraftRows => {
  const target = move.index + move.offset
  const current = rows[move.index]
  const swapped = rows[target]
  if (current === undefined || swapped === undefined) {
    return rows
  }
  return rows.map((row, position) => {
    if (position === move.index) {
      return swapped
    }
    return position === target ? current : row
  })
}

export const isComplete = (rows: DraftRows): boolean =>
  rows.length > 0 && rows.every((row) => row.driverId !== EMPTY_SLOT)

export const driverIdsOf = (rows: DraftRows): readonly string[] => rows.map((row) => row.driverId)
