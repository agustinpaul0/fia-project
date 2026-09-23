import { describe, expectTypeOf, it } from 'vitest'
import type { Category, CreateCategoryBody } from '../../contracts'
import type { CategoryRow, NewCategoryRow } from './categories'

describe('tabla categories ⇔ contratos', () => {
  it('el cuerpo de alta es insertable en la tabla', () => {
    expectTypeOf<CreateCategoryBody>().toExtend<NewCategoryRow>()
  })

  it('el DTO expone exactamente las columnas de la tabla', () => {
    expectTypeOf<keyof Category>().toEqualTypeOf<keyof CategoryRow>()
  })
})
