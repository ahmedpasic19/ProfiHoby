import { z } from 'zod'

import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'

import { createPresignedPost } from '@aws-sdk/s3-presigned-post'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

import { env } from '../../../env/server.mjs'

const BUCKET_REGION = env.BUCKET_REGION
const BUCKET_NAME = env.BUCKET_NAME
const SECRET_ACCES_KEY = env.SECRET_ACCES_KEY
const ACCESS_KEY = env.ACCESS_KEY

const s3 = new S3Client({
  region: BUCKET_REGION,
  credentials: {
    accessKeyId: ACCESS_KEY,
    secretAccessKey: SECRET_ACCES_KEY,
  },
})

export const imageRouter = createTRPCRouter({
  createPresignedURL: adminProcedure
    .input(
      z.object({
        name: z.string(),
        article_id: z.string(),
        action_id: z.string(),
        contentType: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const key = `${input.name}-${input.article_id || input.action_id}`

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
      const { url, fields } = await createPresignedPost(s3, {
        Fields: {
          acl: 'public-read',
        },
        Key: key,
        Conditions: [
          ['starts-with', '$Content-Type', 'image/'],
          ['content-length-range', 0, 1000000],
        ],
        Expires: 60,
        Bucket: BUCKET_NAME,
      })

      return { url, fields, key } as
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
        kind: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Find image by provided aws-key
      const image = await ctx.prisma.image.findUnique({
        where: { key: input.key },
      })

      if (!image?.key) return

      // Permanent access url
      const access_url = `https://${input.kind}.s3.${BUCKET_REGION}.amazonaws.com/${input.key}`
      console.log('accessrul :', access_url)
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
      const command = new DeleteObjectCommand({
        Bucket: BUCKET_NAME,
        Key: input.key,
      })

      const data = await s3.send(command)

      const deleted_image = await ctx.prisma.image.delete({
        where: { id: input.id },
      })
      return { deleted_image, data }
    }),
})
