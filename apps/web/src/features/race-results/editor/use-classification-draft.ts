import { useRef, useState } from 'react'
import {
  addRow,
  type DraftRows,
  moveRow,
  removeRow,
  setRow,
  toDraftRows,
} from './classification-draft'

export type ClassificationDraft = {
  readonly rows: DraftRows
  readonly add: () => void
  readonly remove: (index: number) => void
  readonly choose: (index: number, driverId: string) => void
  readonly move: (index: number, offset: -1 | 1) => void
  readonly reset: () => void
}

export const useClassificationDraft = (initial: readonly string[]): ClassificationDraft => {
  const [rows, setRows] = useState<DraftRows>(() => toDraftRows(initial))
  const nextKey = useRef(0)
  return {
    rows,
    add: () => {
      nextKey.current += 1
      const key = `nueva-${nextKey.current}`
      setRows((current) => addRow(current, key))
    },
    remove: (index) => setRows((current) => removeRow(current, index)),
    choose: (index, driverId) => setRows((current) => setRow(current, { index, driverId })),
    move: (index, offset) => setRows((current) => moveRow(current, { index, offset })),
    reset: () => setRows(toDraftRows(initial)),
  }
}
