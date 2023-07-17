import { CategoriesOnArticle, Category, Image } from '@prisma/client'

export type TArticle = {
  image: Image[]
  id: string
  name: string
  description: string
  base_price: number
  createdAt: Date
  updatedAt: Date
  categories: (CategoriesOnArticle & { category: Category })[]
  onDiscount?: boolean | null
  discountPrice?: number | null
  discountPercentage?: number | null
}
