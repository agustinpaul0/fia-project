import type { ReactNode } from 'react'
import { RequireRole } from './require-role'

export const RequireFiaAdmin = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <RequireRole allowedRole="fia_admin">{children}</RequireRole>
)
