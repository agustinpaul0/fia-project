import type { TechnicalControl } from '@fia/shared/contracts'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { TechnicalControlsRow } from './technical-controls-row'

const minimalControl: TechnicalControl = {
  id: '00000000-0000-4000-8000-000000000001',
  teamId: '00000000-0000-4000-8000-000000000010',
  teamName: 'McLaren',
  driverId: null,
  driverName: null,
  carNumber: null,
  raceId: null,
  raceName: null,
  controlType: 'fuel',
  status: 'rejected',
  notes: null,
  inspectedAt: '2026-05-24T14:30:00.000Z',
  expiresAt: null,
  version: 1,
  createdAt: '2026-05-24T14:35:00.000Z',
}

describe('TechnicalControlsRow', () => {
  it('renderiza correctamente un control mínimo con guiones en opcionales', () => {
    render(
      <table>
        <tbody>
          <TechnicalControlsRow control={minimalControl} />
        </tbody>
      </table>,
    )
    expect(screen.getByText('McLaren')).toBeInTheDocument()
    expect(screen.getByText('Combustible')).toBeInTheDocument()
    expect(screen.getByText('Rechazado')).toBeInTheDocument()
    expect(screen.getAllByText('—').length).toBeGreaterThanOrEqual(2)
  })
})
