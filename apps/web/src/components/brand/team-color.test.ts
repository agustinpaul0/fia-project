import { describe, expect, it } from 'vitest'
import { teamColor } from './team-color'

describe('teamColor', () => {
  it('reconoce la escudería por su nombre sin importar mayúsculas', () => {
    expect(teamColor('Scuderia Ferrari').solid).toBe('bg-[#e8002d]')
    expect(teamColor('MERCEDES-AMG PETRONAS').chip).toContain('#00a19c')
    expect(teamColor('Red Bull Racing').solid).toBe('bg-[#1e3a8a]')
    expect(teamColor('Visa Cash App Racing Bulls').solid).toBe('bg-[#6692ff]')
  })

  it('usa un color neutro para escuderías desconocidas', () => {
    expect(teamColor('Escudería test')).toEqual({
      solid: 'bg-primary',
      chip: 'border-outline bg-surface-container text-on-surface',
    })
  })
})
