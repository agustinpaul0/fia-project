import type { ReactNode } from 'react'
import { RequireRole } from './require-role'

export const RequireTeamStaff = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <RequireRole allowedRole="team_staff">{children}</RequireRole>
)
