import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'

const linkClass = 'text-sm font-medium text-muted-foreground hover:text-foreground'
const activeProps = { className: 'text-foreground' }

export const MainNav = (): ReactNode => (
  <nav aria-label="Principal" className="flex items-center gap-4">
    <Link to="/" className={linkClass} activeProps={activeProps} activeOptions={{ exact: true }}>
      Inicio
    </Link>
    <Link to="/results" className={linkClass} activeProps={activeProps}>
      Resultados
    </Link>
  </nav>
)
