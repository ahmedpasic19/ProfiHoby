import { TArticle } from './article'
import { TActionWithImage } from './action'
import { Category, Group } from '@prisma/client'

// Props passed from getServerSideProps
export type THopePageData = {
  initial_article_data: {
    pages: {
      articles: TArticle[]
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
