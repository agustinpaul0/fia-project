import { Link } from '@tanstack/react-router'
import type { ReactNode } from 'react'
import { PageFrame } from '@/components/common/page-query-view'

export const NotFoundPage = (): ReactNode => (
  <PageFrame>
    <div className="mx-auto flex max-w-xl flex-col items-center gap-4 border-2 border-outline bg-surface-container-lowest px-6 py-12 text-center shadow-brutal-lg">
      <span className="font-bold font-headline text-6xl text-on-surface">404</span>
      <p className="font-label text-on-surface-variant text-sm uppercase tracking-wider">
        La página que buscás no existe.
      </p>
      <Link
        to="/"
        className="border-2 border-outline bg-primary px-4 py-2 font-bold font-headline text-on-primary text-xs uppercase tracking-wider transition-colors hover:bg-primary-container hover:text-primary"
      >
        Volver al inicio
      </Link>
    </div>
  </PageFrame>
)
