import type { ReactNode } from 'react'
import { QueryView } from '@/components/common/query-view'
import { useCategories } from '../hooks/use-categories'
import { CategoryList } from './category-list'

export const CategoriesSection = (): ReactNode => (
  <section className="flex flex-col gap-4">
    <h2 className="text-xl font-semibold">Categorías</h2>
    <QueryView
      query={useCategories()}
      isEmpty={(categories) => categories.length === 0}
      emptyMessage="Todavía no hay categorías cargadas."
    >
      {(categories) => <CategoryList categories={categories} />}
    </QueryView>
  </section>
)
