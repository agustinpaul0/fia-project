import type { Category } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { orderCategories } from '../category-order'
import { CategoryCard } from './category-card'

type CategoryListProps = { readonly categories: readonly Category[] }

export const CategoryList = ({ categories }: CategoryListProps): ReactNode => (
  <ul className="grid grid-cols-1 gap-8 lg:grid-cols-2">
    {orderCategories(categories).map((category, index) => (
      <li key={category.id}>
        <CategoryCard category={category} index={index} />
      </li>
    ))}
  </ul>
)
