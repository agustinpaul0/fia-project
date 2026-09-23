import { createFileRoute } from '@tanstack/react-router'
import { CategoriesSection } from '@/features/categories/components/categories-section'

export const Route = createFileRoute('/')({
  component: CategoriesSection,
})
