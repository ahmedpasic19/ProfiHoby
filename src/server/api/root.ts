import { createTRPCRouter } from './trpc'
import { exampleRouter } from './routers/example'
import { articleRouter } from './routers/article'
import { imageRouter } from './routers/image'
import { categoryRouter } from './routers/category'
import { categoryOnArticleRelationRouter } from './routers/categoryOnArticle'
import { articleActionRouter } from './routers/articleActions'

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  article: articleRouter,
  image: imageRouter,
  category: categoryRouter,
  article_category_relation: categoryOnArticleRelationRouter,
  article_action: articleActionRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
