import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const imageRouter = createTRPCRouter({
  postArticleImage: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_image = await ctx.prisma.image.create({
        data: {
          article_id: input.article_id,
          name: input.name,
          image: input.image,
        },
      })

      return new_image
    }),

  getAllArticleImages: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article_images = await ctx.prisma.image.findMany({
        where: { article_id: input.id },
      })

      return article_images
    }),

  getArticleImage: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article_image = await ctx.prisma.image.findMany({
        where: { article_id: input.id },
      })
      return article_image
    }),

  updateArticleImage: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        image: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_article = await ctx.prisma.image.update({
        where: { id: input.id },
        data: {
          id: input.id,
          name: input.name,
          image: input.image,
        },
      })

      return updated_article
    }),

  deleteArticleImage: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deleted_image = await ctx.prisma.image.delete({
        where: { id: input.id },
      })
      return deleted_image
    }),
})
