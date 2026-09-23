import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { EmptyState } from '@/components/common/empty-state'

export const NotFoundPage = (): ReactNode => (
  <div className="flex flex-col items-center gap-4">
    <EmptyState message="La página que buscás no existe." />
    <Link to="/" className="text-sm underline">
      Volver al inicio
    </Link>
  </div>
)
