import { describe, expectTypeOf, it } from 'vitest'
import type { CreateRaceBody, Race } from '../../contracts'
import type { NewRaceRow, RaceRow } from './races'

describe('tabla races ⇔ contratos', () => {
  it('el cuerpo de alta es insertable en la tabla', () => {
    expectTypeOf<Omit<CreateRaceBody, 'date'>>().toExtend<Omit<NewRaceRow, 'date'>>()
  })

  it('el DTO expone exactamente las columnas de la tabla', () => {
    expectTypeOf<keyof Race>().toEqualTypeOf<keyof RaceRow>()
  })

  it('el tipo de carrera coincide entre tabla y contrato', () => {
    expectTypeOf<Race['type']>().toEqualTypeOf<RaceRow['type']>()
  })
})
