import type { CreateTeamStaffBody } from '@fia/shared/contracts'
import { fireEvent, screen } from '@testing-library/react'

export const CREATE_LABELS: Readonly<Record<keyof CreateTeamStaffBody, string>> = {
  firstName: 'Nombre',
  lastName: 'Apellido',
  email: 'Correo electrónico',
  password: 'Contraseña inicial',
  teamId: 'Escudería',
  roleInTeam: 'Cargo en la escudería',
  phoneNumber: 'Teléfono',
  fileNumber: 'Legajo',
}

export const aCreateBody = (teamId: string): CreateTeamStaffBody => ({
  firstName: 'Charles',
  lastName: 'Leclerc',
  email: 'charles@ferrari.com',
  password: 'Password123!',
  teamId,
  roleInTeam: 'Jefe de Mecánicos',
  phoneNumber: '+54 9 291 1234567',
  fileNumber: 'LEG-1234',
})

export const fillCreateForm = (body: CreateTeamStaffBody): void => {
  for (const [field, label] of Object.entries(CREATE_LABELS)) {
    const value = body[field as keyof CreateTeamStaffBody]
    fireEvent.change(screen.getByLabelText(label), { target: { value } })
  }
}
