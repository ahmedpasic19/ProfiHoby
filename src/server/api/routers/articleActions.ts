import { z } from 'zod'

import { createTRPCRouter, adminProcedure } from '../trpc'

const TTArticle = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  base_price: z.number(),
})

export const articleActionRouter = createTRPCRouter({
  createArticleAction: adminProcedure
    .input(
      z.object({
        title: z.string(),
        discount: z.number(),
        description: z.optional(z.string()),
        date: z.date().nullable(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_article_action = await ctx.prisma.articleAction.create({
        data: {
          discount: input.discount,
          title: input.title,
          date: input.date,
          description: input.description,
        },
      })

      return new_article_action
    }),
  updateArticleAction: adminProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        discount: z.number(),
        description: z.string().nullable(),
        articles: z.array(TTArticle),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_article_action = await ctx.prisma.articleAction.update({
        where: {
          id: input.id,
        },
        data: {
          discount: input.discount,
          title: input.title,
          description: input.description,
          articles: {
            set: input.articles.map(({ id }) => ({ id })),
          },
        },
      })

      return updated_article_action
    }),
  deleteArticleAction: adminProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deleted_article_action = await ctx.prisma.articleAction.delete({
        where: {
          id: input.id,
        },
      })

      return deleted_article_action
    }),

  getAllArticleActions: adminProcedure.query(async ({ ctx }) => {
    const all_actions = await ctx.prisma.articleAction.findMany()
    return all_actions
  }),

  getArticleAction: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article_action = await ctx.prisma.articleAction.findUnique({
        where: { id: input.id },
      })
      return article_action
    }),
})
