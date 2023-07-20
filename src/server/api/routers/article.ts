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
          articles: { some: { article: {} } },
        },
        include: {
          articles: {
            orderBy: { article: { onDiscount: 'desc' } },
            take: input.pageSize,
            include: {
              article: {
                include: {
                  image: true,
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
        take: 3,
        orderBy: { createdAt: 'desc' },
      })

      const total_groups = await ctx.prisma.group.count()

      const pageCount = Math.ceil(total_groups / 3)

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
        name: z.string().nullish(),
        priceFrom: z.number().nullish(),
        priceTo: z.number().nullish(),
        orderByPrice: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const articles = await ctx.prisma.article.findMany({
        include: {
          attributes: {
            select: {
              text: true,
              title: true,
              id: true,
            },
          },
          image: true,
          brand: { select: { name: true } },
          categories: {
            include: {
              category: true,
            },
          },
        },
        where: {
          ...(input.name
            ? {
                name: {
                  contains: input.name,
                  mode: 'insensitive',
                },
              }
            : {}),
          ...(input.priceFrom || input.priceTo
            ? {
                base_price: {
                  ...(input.priceFrom ? { gte: input.priceFrom } : {}),
                  ...(input.priceTo ? { lte: input.priceTo } : {}),
                },
              }
            : {}),
        },
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        ...(input.orderByPrice
          ? {
              orderBy: {
                base_price: input.orderByPrice === 'desc' ? 'desc' : 'asc',
              },
            }
          : {}),
      })

      const totalArticles = await ctx.prisma.article.count({
        where: {
          ...(input.name
            ? {
                name: {
                  contains: input.name,
                  mode: 'insensitive',
                },
              }
            : {}),
        },
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      return {
        articles,
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

      const articles = await ctx.prisma.article.findMany({
        include: {
          image: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        where: category
          ? { categories: { some: { category: { id: input.category_id } } } }
          : name
          ? {
              name: {
                contains: input.name,
                mode: 'insensitive',
              },
            }
          : {},
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
      })

      const totalArticles = await ctx.prisma.article.count({
        where: category
          ? { categories: { some: { category: { id: input.category_id } } } }
          : name
          ? {
              name: {
                contains: input.name,
                mode: 'insensitive',
              },
            }
          : {},
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      return {
        articles,
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
            categories: {
              include: {
                category: true,
              },
            },
          },
        })

        return articles
      }
    }),

  getArticlesByGroupID: publicProcedure
    .input(
      z.object({
        group_id: z.string(),
        pageSize: z.number(),
        pageIndex: z.number(),
        priceFrom: z.number().nullish(),
        priceTo: z.number().nullish(),
        brand_id: z.string().nullish(),
        orderByPrice: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.group_id },
        include: {
          articles: {
            // Filter articles by brand and price range
            ...(input.priceFrom || input.priceTo || input.brand_id
              ? {
                  where: {
                    article: {
                      ...(input.priceFrom || input.priceTo
                        ? {
                            base_price: {
                              ...(input.priceFrom
                                ? { gte: input.priceFrom }
                                : {}),
                              ...(input.priceTo ? { lte: input.priceTo } : {}),
                            },
                          }
                        : {}),
                      ...(input.brand_id ? { brand_id: input.brand_id } : {}),
                    },
                  },
                }
              : {}),
            ...(input.orderByPrice
              ? {
                  orderBy: {
                    article: {
                      base_price:
                        input.orderByPrice === 'desc' ? 'desc' : 'asc',
                    },
                  },
                }
              : { orderBy: { article: { onDiscount: 'desc' } } }),
            skip: input.pageSize * input.pageIndex,
            take: input.pageSize,
            include: {
              article: {
                include: {
                  image: true,
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
        priceFrom: z.number().nullish(),
        priceTo: z.number().nullish(),
        orderByPrice: z.string().nullish(),
      })
    )
    .query(async ({ input, ctx }) => {
      const articles = await ctx.prisma.article.findMany({
        include: {
          image: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
        skip: input.pageSize * input.pageIndex,
        take: input.pageSize,
        where: {
          onDiscount: true,
          ...(input.priceFrom || input.priceTo
            ? {
                base_price: {
                  ...(input.priceFrom ? { gte: input.priceFrom } : {}),
                  ...(input.priceTo ? { lte: input.priceTo } : {}),
                },
              }
            : {}),
        },
        ...(input.orderByPrice
          ? {
              orderBy: {
                base_price: input.orderByPrice === 'desc' ? 'desc' : 'asc',
              },
            }
          : {}),
      })

      const totalArticles = await ctx.prisma.article.count({
        where: { onDiscount: true },
      })
      const pageCount = Math.ceil(totalArticles / input.pageSize)

      return {
        articles,
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
          attributes: true,
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

  getArticlesByBrandID: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const brand_articles = await ctx.prisma.article.findMany({
        where: { brand_id: input.id },
        include: {
          image: true,
          categories: {
            include: {
              category: true,
            },
          },
        },
      })

      return brand_articles
    }),

  createArticle: adminProcedure
    .input(
      z.object({
        name: z.string(),
        description: z.string(),
        short_description: z.string().nullish(),
        base_price: z.number(),
        brand_id: z.string().nullish(),
        warranty: z.string().nullish(),
        attributes: z.array(z.object({ title: z.string(), text: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const workerId = await ctx.prisma.worker.findUnique({
        where: { user_id: ctx.session.user.id },
        select: { id: true },
      })

      if (!workerId) return console.log('No worker id')

      const new_article = await ctx.prisma.article.create({
        data: {
          base_price: input.base_price,
          name: input.name,
          description: input.description,
          short_description: input.short_description
            ? input.short_description
            : '',
          warranty: input.warranty ? input.warranty : '',
          ...(input.brand_id ? { brand_id: input.brand_id } : {}), // optionaly accept brand_id
          userId: ctx.session.user.id,
          workerId: workerId.id,
        },
      })

      // Insert article_id
      const attributes = input.attributes.map((att) => ({
        ...att,
        article_id: new_article.id,
      }))

      // Add article attributes
      await ctx.prisma.attribute.createMany({
        data: attributes,
      })

      return new_article
    }),

  updateArticle: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        description: z.string(),
        short_description: z.string().nullish(),
        base_price: z.number(),
        brand_id: z.string().nullish(),
        warranty: z.string().nullish(),
        attributes: z.array(z.object({ title: z.string(), text: z.string() })),
        discountPercentage: z.number().nullish(),
        discountPrice: z.number().nullish(),
        onDiscount: z.boolean().nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_article = await ctx.prisma.article.update({
        where: { id: input.id },
        data: {
          id: input.id,
          name: input.name,
          description: input.description,
          short_description: input.short_description
            ? input.short_description
            : '',
          base_price: input.base_price,
          warranty: input.warranty ? input.warranty : '',
          ...(input.brand_id ? { brand_id: input.brand_id } : {}), // optionaly accept brand_id
          ...(input.discountPercentage !== null &&
          input.discountPercentage !== undefined
            ? { discountPercentage: input.discountPercentage }
            : {}),
          ...(input.discountPrice !== null && input.discountPrice !== undefined
            ? { discountPrice: input.discountPrice }
            : {}),
          ...(input.onDiscount !== null && input.onDiscount !== undefined
            ? { onDiscount: input.onDiscount }
            : {}),
        },
      })

      // DELETE previous attibutes and add new attributes
      await ctx.prisma.attribute.deleteMany({
        where: { article_id: input.id },
      })

      // Insert article_id
      const attributes = input.attributes.map((att) => ({
        ...att,
        article_id: updated_article.id,
      }))

      // ADD new article attributes
      await ctx.prisma.attribute.createMany({
        data: attributes,
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
      await ctx.prisma.attribute.deleteMany({
        where: {
          article_id: input.id,
        },
      })

      const article_images = await ctx.prisma.image.findMany({
        where: { article_id: input.id },
      })

      // Delete images from S3
      for (const image of article_images) {
        s3.deleteObject(
          { Bucket: BUCKET_NAME, Key: image.key },
          (err, data) => {
            if (err) {
              return err
            } else {
              return data
            }
          }
        )
      }

      // Delete article images
      await ctx.prisma.image.deleteMany({
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
