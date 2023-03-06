import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

const TTArticle = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  base_price: z.string(),
})

export const articleActionRouter = createTRPCRouter({
  createArticleAction: publicProcedure
    .input(
      z.object({
        title: z.string(),
        discount: z.number(),
        description: z.optional(z.string()),
        date: z.optional(z.date()),
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
  updateArticleAction: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        discount: z.number(),
        description: z.optional(z.string()),
        // date: z.optional(z.date()),
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
          // // date: input.date,
          description: input.description,
          articles: {
            connect: input.articles.map(({ id }) => ({ id })),
          },
        },
      })

      return updated_article_action
    }),
  deleteArticleAction: publicProcedure
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

  getAllArticleActions: publicProcedure.query(async ({ ctx }) => {
    const all_actions = await ctx.prisma.articleAction.findMany()
    return all_actions
  }),

  getArticleAction: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article_action = await ctx.prisma.articleAction.findUnique({
        where: { id: input.id },
      })
      return article_action
    }),
})
