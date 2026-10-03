import type { Category } from '@fia/shared/contracts'

const TIER_ORDER: readonly string[] = ['F1', 'F2', 'F3', 'F1A']

const tierOf = (code: string): number => {
  const index = TIER_ORDER.indexOf(code)
  return index === -1 ? TIER_ORDER.length : index
}

export const orderCategories = (categories: readonly Category[]): readonly Category[] =>
  [...categories].sort((a, b) => tierOf(a.code) - tierOf(b.code) || a.code.localeCompare(b.code))
