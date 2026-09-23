import type { Category } from '@fia/shared/contracts'
import type { ReactNode } from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle } from '@/components/ui/card'

type CategoryCardProps = { readonly category: Category }

export const CategoryCard = ({ category }: CategoryCardProps): ReactNode => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{category.name}</CardTitle>
      <Badge variant="outline">{category.code}</Badge>
    </CardHeader>
  </Card>
)
