import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useCategories } from '../hooks/use-categories'
import { CategoriesHero } from './categories-hero'
import { CategoryList } from './category-list'

export const CategoriesSection = ({ now = new Date() }: { readonly now?: Date }): ReactNode => {
  const query = useCategories()
  return (
    <div className="flex w-full flex-col">
      <CategoriesHero total={query.data?.length ?? null} season={now.getFullYear()} />
      <section className="w-full px-6 py-10 lg:px-12">
        <QueryView
          query={query}
          isEmpty={(categories) => categories.length === 0}
          emptyMessage="Todavía no hay categorías cargadas."
        >
          {(categories) => <CategoryList categories={categories} />}
        </QueryView>
      </section>
    </div>
  )
}
