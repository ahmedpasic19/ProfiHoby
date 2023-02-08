import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const articleRouter = createTRPCRouter({
  createArticle: publicProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        base_price: z.number(),
        discount: z.number().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_article = await ctx.prisma.article.create({
        data: {
          base_price: input.base_price,
          discount: input.discount,
          name: input.name,
          description: input.description,
        },
      })

      return new_article
    }),

  getAllArticles: publicProcedure.query(async ({ ctx }) => {
    const articles = await ctx.prisma.article.findMany({
      include: { image: true, categories: true },
    })
    return articles
  }),

  getArticle: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { id: input.id },
      })
      return article
    }),

  updateArticle: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        base_price: z.number(),
        discount: z.number().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_article = await ctx.prisma.article.update({
        where: { id: input.id },
        data: {
          id: input.id,
          name: input.name,
          description: input.description,
          base_price: input.base_price,
          discount: input.discount,
        },
      })

      return updated_article
    }),

  deleteArticle: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.prisma.article.delete({
        where: { id: input.id },
      })
      return article
    }),
})
