import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const categoryOnArticleRelationRouter = createTRPCRouter({
  createRelation: publicProcedure
    .input(
      z.array(z.object({ article_id: z.string(), category_id: z.string() }))
    )
    .mutation(async ({ input, ctx }) => {
      const new_relations = await ctx.prisma.categoriesOnArticle.createMany({
        data: input,
      })

      return new_relations
    }),

  updateRelation: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        categories: z.array(
          z.object({
            article_id: z.string(),
            category_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // DELETE previous relation
      await ctx.prisma.categoriesOnArticle.deleteMany({
        where: { article_id: input.article_id },
      })

      // UPDATE by creating a new relation
      const new_relations = await ctx.prisma.categoriesOnArticle.createMany({
        data: input.categories,
      })

      return new_relations
    }),

  deleteRelation: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        category_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deleted_relation = await ctx.prisma.categoriesOnArticle.delete({
        where: {
          article_id_category_id: {
            article_id: input.article_id,
            category_id: input.category_id,
          },
        },
      })

      return deleted_relation
    }),

  getArticleCategories: publicProcedure
    .input(
      z.object({ article_id: z.string(), categories: z.array(z.string()) })
    )
    .query(async ({ input, ctx }) => {
      const article_categories = await ctx.prisma.category.findMany({
        where: { articles: { some: { article_id: input.article_id } } },
      })

      return article_categories
    }),

  getAllRelations: publicProcedure.query(async ({ ctx }) => {
    const all_relations = await ctx.prisma.categoriesOnArticle.findMany()

    return all_relations
  }),

  getRelation: publicProcedure
    .input(
      z.object({
        article_id: z.string(),
        category_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const relation = await ctx.prisma.categoriesOnArticle.findUnique({
        where: {
          article_id_category_id: {
            article_id: input.article_id,
            category_id: input.category_id,
          },
        },
      })

      return relation
    }),
})
