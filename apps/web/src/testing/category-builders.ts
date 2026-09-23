import type { Category } from '@fia/shared/contracts'

export const aCategory = (overrides: Partial<Category> = {}): Category => ({
  id: '00000000-0000-4000-8000-000000000001',
  name: 'Fórmula 1',
  code: 'F1',
  version: 1,
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  ...overrides,
})
