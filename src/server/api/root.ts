import { createTRPCRouter } from './trpc'
import { exampleRouter } from './routers/example'
import { articleRouter } from './routers/article'
import { imageRouter } from './routers/image'
import { categoryRouter } from './routers/category'
import { categoryOnArticleRelationRouter } from './routers/categoryOnArticle'
import { groupRouter } from './routers/groups'
import { articleGroups } from './routers/articleGroups'
import { userRouter } from './routers/user'
import { workerRouter } from './routers/worker'
import { brandRouter } from './routers/brand'

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  article: articleRouter,
  image: imageRouter,
  category: categoryRouter,
  article_category_relation: categoryOnArticleRelationRouter,
  group: groupRouter,
  articleGroups: articleGroups,
  users: userRouter,
  workers: workerRouter,
  brand: brandRouter,
})

// export type definition of API
export type AppRouter = typeof appRouter
