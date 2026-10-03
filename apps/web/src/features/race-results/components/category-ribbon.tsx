import { Link } from '@tanstack/react-router'
import { Filter } from 'lucide-react'
import type { ReactNode } from 'react'
import { orderCategories } from '@/features/categories/category-order'
import { useCategories } from '@/features/categories/hooks/use-categories'

const CHIP = 'border border-outline px-2.5 py-1 transition-colors'

export const CategoryRibbon = ({ current }: { readonly current: string }): ReactNode => {
  const categories = orderCategories(useCategories().data ?? [])
  return (
    <nav
      aria-label="Categorías"
      className="flex w-full flex-wrap items-center gap-3 border-outline border-b-2 bg-surface px-6 py-3 font-label text-xs uppercase lg:px-8"
    >
      <span className="flex items-center gap-1.5 font-bold text-on-surface tracking-wider">
        <Filter className="size-3.5" aria-hidden /> Categoría:
      </span>
      {categories.map((category) => (
        <Link
          key={category.id}
          to="/results"
          search={{ category: category.code }}
          aria-current={category.code === current ? 'page' : undefined}
          className={
            category.code === current
              ? `${CHIP} bg-primary font-bold text-on-primary`
              : `${CHIP} bg-surface hover:bg-primary hover:text-on-primary`
          }
        >
          {category.name}
        </Link>
      ))}
    </nav>
  )
}
