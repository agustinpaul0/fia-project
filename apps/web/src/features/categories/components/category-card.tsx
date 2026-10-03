import type { Category } from '@fia/shared/contracts'
import { Link } from '@tanstack/react-router'
import { cn } from 'cn'
import { ArrowRight } from 'lucide-react'
import type { ReactNode } from 'react'
import { accentFor } from './category-accents'

type CategoryCardProps = {
  readonly category: Category
  readonly index: number
}

export const CategoryCard = ({ category, index }: CategoryCardProps): ReactNode => {
  const accent = accentFor(index)
  const order = String(index + 1).padStart(2, '0')
  return (
    <Link
      to="/results"
      search={{ category: category.code }}
      aria-label={`Ver resultados de ${category.name}`}
      className={cn(
        'group relative flex h-full flex-col justify-between border-2 border-outline bg-surface-container-lowest p-6 shadow-[6px_6px_0px_#1a1a1a] transition-all duration-200 hover:translate-x-1 hover:-translate-y-1 sm:p-8',
        accent.hover,
      )}
    >
      <div>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold font-mono text-on-surface-variant text-xs">
              {`${order} // TIER-${index + 1}`}
            </span>
            <span className={cn('h-1.5 w-1.5 rounded-full', accent.dot)} />
            <span
              className={cn(
                'font-bold font-label text-[11px] uppercase tracking-wider',
                accent.text,
              )}
            >
              Categoría oficial FIA
            </span>
          </div>
          <span
            className={cn(
              'border-2 border-outline px-4 py-1.5 font-bold font-headline text-xl uppercase tracking-wider shadow-[2px_2px_0px_#1a1a1a]',
              accent.badge,
            )}
          >
            {category.code}
          </span>
        </div>
        <h2 className="font-bold font-headline text-3xl text-on-surface uppercase tracking-tight sm:text-4xl">
          {category.name}
        </h2>
        <p
          className={cn(
            'mt-2 font-mono font-semibold text-xs uppercase tracking-wide',
            accent.text,
          )}
        >
          Código de categoría: {category.code}
        </p>
      </div>
      <div className="mt-8 flex items-center justify-between border-outline border-t-2 pt-5">
        <div className="flex items-center gap-2 font-bold font-label text-on-surface-variant text-xs uppercase">
          <span className={cn('h-2 w-2 rounded-full border border-outline', accent.dot)} />
          Campeonato y calendario
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-2 border-2 border-outline px-4 py-2 font-bold font-headline text-xs uppercase tracking-wider transition-all group-hover:translate-x-1',
            accent.cta,
          )}
        >
          Explorar temporada
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </Link>
  )
}
