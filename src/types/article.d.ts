import { CategoriesOnArticle, Category } from '@prisma/client'

export type TArticle = {
  image: {
    url: string
    id: string
    name: string
    image: string
    article_id: string | null
    userId: string | null
  }[]
  id: string
  name: string
  description: string
  base_price: number
  article_action_id: string | null
  createdAt: Date
  updatedAt: Date
  categories: (CategoriesOnArticle & { category: Category })[]
}
