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

export const imageRouter = createTRPCRouter({
  createPresignedURL: publicProcedure
    .input(z.object({ name: z.string(), article_id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.image.create({
        data: {
          article_id: input.article_id,
          name: input.name,
          image: `${input.name}-${input.article_id}`,
        },
      })

      let data
      s3.createPresignedPost(
        {
          Fields: {
            key: `${input.name}-${input.article_id}`,
          },
          Conditions: [
            ['starts-with', '$Content-Type', 'image/'],
            ['content-length-range', 0, 1000000],
          ],
          Expires: 30,
          Bucket: BUCKET_NAME,
        },
        (err, signed) => {
          if (err) data = err
          else data = signed
        }
      )

      return data as
        | {
            url: string
            fields: object
          }
        | undefined
    }),

  postArticleImage: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        name: z.string(),
        image: z.string(),
        formData: z.any(),
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

      const extended_images = await Promise.all(
        article_images.map(async (image) => ({
          ...image,
          url: await s3.getSignedUrlPromise('getObject', {
            Bucket: BUCKET_NAME,
            Key: image.image,
          }),
        }))
      )

      return extended_images
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
    .input(z.object({ id: z.string(), key: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const data = s3.deleteObject(
        { Bucket: BUCKET_NAME, Key: input.key },
        (err, data) => {
          if (err) {
            return err
          } else {
            return data
          }
        }
      )

      const deleted_image = await ctx.prisma.image.delete({
        where: { id: input.id },
      })
      return { deleted_image, data }
    }),
})
