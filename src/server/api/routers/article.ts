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

export const articleRouter = createTRPCRouter({
  createArticle: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        base_price: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_article = await ctx.prisma.article.create({
        data: {
          base_price: input.base_price,
          name: input.name,
          description: input.description,
        },
      })

      return new_article
    }),

  // GET all articles and filter by category if category is provided
  getAllArticlesForHomePage: publicProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const groups_with_articles = await ctx.prisma.group.findMany({
        where: {
          articles: { some: {} },
        },
        include: {
          articles: {
            take: 20,
            include: {
              article: {
                include: {
                  image: true,
                  action: true,
                  categories: {
                    include: {
                      category: true,
                    },
                  },
                },
              },
            },
          },
        },
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        orderBy: { createdAt: 'desc' },
      })

      const total_groups = await ctx.prisma.group.count()

      const pageCount = Math.ceil(total_groups / input.pageSize)

      // Assigning an accessURL from S3
      for (const group of groups_with_articles) {
        for (const article of group.articles) {
          const extended_images = article.article.image.map((image) => ({
            ...image,
            url: s3.getSignedUrl('getObject', {
              Bucket: BUCKET_NAME,
              Key: image.image,
            }),
          }))

          article.article.image = extended_images
        }
      }

      return {
        group_articles: groups_with_articles,
        pageCount,
        pageIndex: input.pageIndex,
        pageSize: input.pageSize,
      }
    }),

  // GET all articles and filter by category if category is provided
  getAllArticles: publicProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
        name: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const name = input.name
      const where = name
        ? {
            name: {
              contains: input.name,
            },
          }
        : {}

      const articles = await ctx.prisma.article.findMany({
        include: {
          image: true,
          action: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        // where,
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        orderBy: { createdAt: 'desc' },
      })

      const totalArticles = await ctx.prisma.article.count({
        where,
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      // Assigning an accessURL from S3
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

      return {
        articles: arr,
        pageCount,
        pageIndex: input.pageIndex,
        pageSize: input.pageSize,
      }
    }),

  getAllArticleByCategoryID: publicProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
        category_id: z.string(),
        name: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const category = input.category_id
      const name = input.name
      const where = category
        ? { categories: { some: { category: { id: input.category_id } } } }
        : name
        ? {
            name: {
              contains: input.name,
            },
          }
        : {}

      const articles = await ctx.prisma.article.findMany({
        include: {
          image: true,
          action: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        where,
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
      })

      const totalArticles = await ctx.prisma.article.count({
        where,
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      // Assigning an accessURL from S3
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

      return {
        articles: arr,
        pageCount,
        pageIndex: input.pageIndex,
        pageSize: input.pageSize,
      }
    }),

  getArticlesByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      if (!input.name) return []
      else {
        const articles = await ctx.prisma.article.findMany({
          where: {
            name: {
              contains: input.name.toLowerCase(),
              mode: 'insensitive',
            },
          },
          include: {
            image: true,
            action: true,
            categories: {
              include: {
                category: true,
              },
            },
          },
        })

        // Assigning an accessURL from S3
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
      }
    }),

  getArticlesByActionID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const articles = await ctx.prisma.article.findMany({
        where: {
          article_action_id: input.id,
        },
        include: {
          image: true,
          action: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      })

      // Assigning an accessURL from S3
      const action_articles = articles.map((article) => {
        const extended_images = article.image.map((image) => ({
          ...image,
          url: s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: image.image,
          }),
        }))

        return { ...article, image: extended_images }
      })

      return action_articles
    }),

  getArticlesByGroupID: publicProcedure
    .input(
      z.object({
        group_id: z.string(),
        pageSize: z.number(),
        pageIndex: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.group_id },
        include: {
          articles: {
            skip: input.pageSize * input.pageIndex,
            take: input.pageSize,
            include: {
              article: {
                include: {
                  image: true,
                  action: true,
                  categories: { include: { category: true } },
                },
              },
            },
          },
        },
      })

      const totalArticles = await ctx.prisma.article.count({
        where: { groups: { some: { group_id: input.group_id } } },
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      if (group) {
        for (const article of group.articles) {
          if (article.article.image) {
            const extended_images = article.article.image.map((image) => ({
              ...image,
              url: s3.getSignedUrl('getObject', {
                Bucket: BUCKET_NAME,
                Key: image.image,
              }),
            }))

            article.article.image = extended_images
          }
        }
      }

      return {
        group,
        pageCount,
        pageIndex: input.pageIndex,
        pageSize: input.pageSize,
      }
    }),

  // GET only articles that have an action (sale🤑)
  getAllArticlesWithActions: publicProcedure
    .input(
      z.object({
        pageSize: z.number(),
        pageIndex: z.number(),
      })
    )
    .query(async ({ input, ctx }) => {
      const articles = await ctx.prisma.article.findMany({
        include: {
          action: true,
          image: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        where: { article_action_id: { not: null } },
        orderBy: { createdAt: 'asc' },
      })

      // Assigning an accessURL from S3
      const action_articles = articles.map((article) => {
        const extended_images = article.image.map((image) => ({
          ...image,
          url: s3.getSignedUrl('getObject', {
            Bucket: BUCKET_NAME,
            Key: image.image,
          }),
        }))

        return { ...article, image: extended_images }
      })

      const totalArticles = await ctx.prisma.article.count({
        where: { article_action_id: { not: null } },
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      return {
        articles: action_articles,
        pageCount,
        pageIndex: input.pageIndex,
        pageSize: input.pageSize,
      }
    }),

  getArticle: publicProcedure
    .input(z.object({ article_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article = await ctx.prisma.article.findUnique({
        where: { id: input.article_id },
        include: {
          groups: {
            include: {
              group: true,
            },
          },
          categories: {
            include: {
              category: {
                include: {
                  groups: true,
                },
              },
            },
          },
        },
      })
      return article
    }),

  updateArticle: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        base_price: z.number(),
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
        },
      })

      return updated_article
    }),

  deleteArticle: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // DELETE realtions
      await ctx.prisma.articleGroups.deleteMany({
        where: {
          article_id: input.id,
        },
      })
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
