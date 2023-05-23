import {
  ArticleAction,
  CategoriesOnArticle,
  Category,
  Image,
} from '@prisma/client'

export type TArticle = {
  image: Image[]
  id: string
  name: string
  description: string
  base_price: number
  article_action_id: string | null
  createdAt: Date
  updatedAt: Date
  categories: (CategoriesOnArticle & { category: Category })[]
  action: ArticleAction | null
}
