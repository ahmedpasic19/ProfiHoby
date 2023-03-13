import { createTRPCRouter } from './trpc'
import { exampleRouter } from './routers/example'
import { articleRouter } from './routers/article'
import { imageRouter } from './routers/image'
import { categoryRouter } from './routers/category'
import { categoryOnArticleRelationRouter } from './routers/categoryOnArticle'
import { articleActionRouter } from './routers/articleActions'
import { groupRouter } from './routers/groups'
import { articleGroups } from './routers/articleGroups'

export const appRouter = createTRPCRouter({
  example: exampleRouter,
  article: articleRouter,
  image: imageRouter,
  category: categoryRouter,
  article_category_relation: categoryOnArticleRelationRouter,
  article_action: articleActionRouter,
  group: groupRouter,
  articleGroups: articleGroups,
})

// export type definition of API
export type AppRouter = typeof appRouter
