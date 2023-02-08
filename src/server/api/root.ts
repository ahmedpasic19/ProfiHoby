import { createTRPCRouter } from './trpc'
import { exampleRouter } from './routers/example'
import { articleRouter } from './routers/article'
import { imageRouter } from './routers/image'
import { categoryRouter } from './routers/category'
import { categoryOnArticleRelationRouter } from './routers/categoryOnArticle'

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  article: articleRouter,
  image: imageRouter,
  category: categoryRouter,
  article_category_relation: categoryOnArticleRelationRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
