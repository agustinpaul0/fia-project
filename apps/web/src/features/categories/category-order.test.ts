import { describe, expect, it } from 'vitest'
import { aCategory } from '@/testing/category-builders'
import { orderCategories } from './category-order'

const withCode = (code: string) => aCategory({ id: code, code, name: code })

describe('orderCategories', () => {
  it('ordena por escalafón FIA y deja al final las demás por código', () => {
    const list = ['F1A', 'GT3', 'F3', 'F1', 'F2', 'E1'].map(withCode)
    expect(orderCategories(list).map((c) => c.code)).toEqual(['F1', 'F2', 'F3', 'F1A', 'E1', 'GT3'])
  })
})
