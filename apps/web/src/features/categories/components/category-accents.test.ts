import { describe, expect, it } from 'vitest'
import { accentFor } from './category-accents'

describe('accentFor', () => {
  it('asigna amarillo, azul, verde y rojo a las cuatro primeras categorías', () => {
    expect(accentFor(0)).toEqual({
      badge: 'bg-primary-container text-primary',
      dot: 'bg-primary',
      text: 'text-secondary',
      hover: 'hover:shadow-[10px_10px_0px_#ffcc00]',
      cta: 'bg-primary text-on-primary group-hover:bg-primary-container group-hover:text-primary',
    })
    expect(accentFor(1)).toEqual({
      badge: 'bg-surface-container-lowest text-primary',
      dot: 'bg-tertiary',
      text: 'text-tertiary',
      hover: 'hover:shadow-[10px_10px_0px_#0055ff]',
      cta: 'bg-surface text-on-surface group-hover:bg-tertiary group-hover:text-on-tertiary',
    })
    expect(accentFor(2)).toEqual({
      badge: 'bg-primary text-on-primary',
      dot: 'bg-outline',
      text: 'text-on-surface-variant',
      hover: 'hover:shadow-[10px_10px_0px_#15803d]',
      cta: 'bg-surface text-on-surface group-hover:bg-fia-green group-hover:text-on-primary',
    })
    expect(accentFor(3)).toEqual({
      badge: 'bg-secondary text-on-primary',
      dot: 'bg-secondary',
      text: 'text-secondary',
      hover: 'hover:shadow-[10px_10px_0px_#e63b2e]',
      cta: 'bg-surface text-on-surface group-hover:bg-secondary group-hover:text-on-primary',
    })
  })

  it('repite los acentos a partir de la quinta categoría', () => {
    expect(accentFor(4)).toEqual(accentFor(0))
    expect(accentFor(7)).toEqual(accentFor(3))
  })
})
