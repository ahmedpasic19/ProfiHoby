import { z } from 'zod'

import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'

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
  createPresignedURL: adminProcedure
    .input(
      z.object({
        name: z.string(),
        article_id: z.string(),
        action_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Key for S3
      const image = `${input.name}-${input.article_id || input.action_id}`
      // POST image to DB
      await ctx.prisma.image.create({
        data: {
          action_id: input.action_id || null,
          article_id: input.article_id || null,
          name: input.name,
          image,
        },
      })

      // GET presigned URL from S3
      let data
      s3.createPresignedPost(
        {
          Fields: {
            key: image,
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

  getAllRelatedImages: publicProcedure
    .input(
      z.object({
        article_id: z.string().nullable(),
        action_id: z.string().nullable(),
      })
    )
    .query(async ({ input, ctx }) => {
      const article_images = await ctx.prisma.image.findMany({
        where: { article_id: input.article_id, action_id: input.action_id },
      })

      const extended_images = await Promise.all(
        article_images.map(async (image) => ({
          ...image,
          url: await s3.getSignedUrlPromise('getObject', {
            Bucket: BUCKET_NAME,
            Key: image.image, // "image" is key (name) to fech by on S3
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

  updateArticleImage: adminProcedure
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

  deleteImage: adminProcedure
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
