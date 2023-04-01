import { TArticle } from './article'
import { TActionWithImage } from './action'
import {
  ArticleAction,
  ArticleGroups,
  CategoriesOnArticle,
  Category,
  Group,
} from '@prisma/client'

// Props passed from getServerSideProps
export type THopePageData = {
  initial_article_data: {
    pages: {
      group_articles: (Group & {
        articles: (ArticleGroups & {
          article: Article & {
            categories: (CategoriesOnArticle & { category: Category })[]
            image: Image[]
            action: ArticleAction | null
          }
        })[]
      })[]
      pageIndex: number
      pageCount: number
      pageSize: number
    }
    pageParams: null[]
  }
  actions: TActionWithImage[]
  categories: (Category & {
    groups: Group[]
  })[]
}
