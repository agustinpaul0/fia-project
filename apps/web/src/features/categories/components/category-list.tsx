import type { Category } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { CategoryCard } from './category-card'

type CategoryListProps = { readonly categories: readonly Category[] }

export const CategoryList = ({ categories }: CategoryListProps): ReactNode => (
  <ul className="grid gap-3 sm:grid-cols-2">
    {categories.map((category) => (
      <li key={category.id}>
        <CategoryCard category={category} />
      </li>
    ))}
  </ul>
)
