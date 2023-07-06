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
      const name = input.name.split('.')[0] // file name
      const extention = input.name.split('.')[1] // file extention

      if (!name || !extention)
        return console.log('ERROR: No name and / or extention')

      // Key for S3
      const key = `${name}-${input.article_id || input.action_id}.${extention}`

      // POST image to DB
      await ctx.prisma.image.create({
        data: {
          action_id: input.action_id || null,
          article_id: input.article_id || null,
          name: input.name,
          key,
        },
      })

      // GET presigned URL from S3
      let data = {}
      s3.createPresignedPost(
        {
          Fields: {
            key,
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

      return { ...data, key } as
        | {
            url: string
            fields: object
            key: string
          }
        | undefined
    }),

  // This API is used right after creating an image,
  // It GET's an access_url from S3 and then SET's it  to db
  generatePermanentAccessURL: adminProcedure
    .input(
      z.object({
        key: z.string(), // "key" field is the object name on the S3 storage
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find image by provided aws-key
      const image = await ctx.prisma.image.findUnique({
        where: { key: input.key },
      })

      if (!image?.key || !image.article_id) return

      // Permanent access url
      const access_url = `https://${BUCKET_NAME}.s3.${BUCKET_REGION}.amazonaws.com/${input.key}`

      // Mark article as published
      // This is to know what articles have been fully added
      await ctx.prisma.article.update({
        where: { id: image.article_id },
        data: {
          published: true,
        },
      })

      await ctx.prisma.image.update({
        where: { id: image?.id },
        data: { access_url },
      })
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
          key: input.image,
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
