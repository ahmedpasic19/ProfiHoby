import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

import AWS from 'aws-sdk'
import { env } from '../../../env/server.mjs'

const BUCKET_REGION = env.BUCKET_REGION
const BUCKET_NAME = env.BUCKET_NAME
const SECRET_ACCES_KEY = env.SECRET_ACCES_KEY
const ACCESS_KEY = env.ACCESS_KEY

const s3 = new AWS.S3({
  region: BUCKET_REGION,
  accessKeyId: ACCESS_KEY,
  secretAccessKey: SECRET_ACCES_KEY,
})

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
      include: {
        image: true,
        categories: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'asc' },
    })

    const arr = articles.map((article) => {
      const extended_images = article.image.map((image) => ({
        ...image,
        url: s3.getSignedUrl('getObject', {
          Bucket: BUCKET_NAME,
          Key: image.image,
        }),
      }))

      return { ...article, image: extended_images }
    })

    return arr
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
    .mutation(async ({ input, ctx }) => {
      // DELETE realtions
      await ctx.prisma.categoriesOnArticle.deleteMany({
        where: {
          article_id: input.id,
        },
      })

      const article = await ctx.prisma.article.delete({
        where: { id: input.id },
      })
      return article
    }),
})
