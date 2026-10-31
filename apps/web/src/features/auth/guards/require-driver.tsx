import type { ReactNode } from 'react'
import { RequireRole } from './require-role'

export const RequireDriver = ({ children }: { readonly children: ReactNode }): ReactNode => (
  <RequireRole allowedRole="driver">{children}</RequireRole>
)
