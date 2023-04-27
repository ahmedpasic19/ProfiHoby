import { z } from 'zod'

import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'

export const articleGroups = createTRPCRouter({
  createRelation: adminProcedure
    .input(z.array(z.object({ article_id: z.string(), group_id: z.string() })))
    .mutation(async ({ input, ctx }) => {
      // DELETE previous relation
      await ctx.prisma.articleGroups.deleteMany({
        where: {
          group_id: input[0]?.group_id,
          article_id: input[0]?.article_id,
        },
      })

      const new_relations = await ctx.prisma.articleGroups.createMany({
        data: input,
      })

      return new_relations
    }),

  updateRelation: adminProcedure
    .input(
      z.object({
        article_id: z.string(),
        groups: z.array(
          z.object({
            article_id: z.string(),
            group_id: z.string(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // DELETE previous relation
      await ctx.prisma.articleGroups.deleteMany({
        where: { article_id: input.article_id },
      })

      // UPDATE by creating a new relation
      const new_relations = await ctx.prisma.articleGroups.createMany({
        data: input.groups,
      })

      return new_relations
    }),

  deleteRelation: adminProcedure
    .input(
      z.object({
        article_id: z.string(),
        group_id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const deleted_relation = await ctx.prisma.articleGroups.delete({
        where: {
          article_id_group_id: {
            article_id: input.article_id,
            group_id: input.group_id,
          },
        },
      })

      return deleted_relation
    }),

  getArticleGropus: publicProcedure
    .input(z.object({ article_id: z.string() }))
    .query(async ({ input, ctx }) => {
      const article_groups = await ctx.prisma.group.findMany({
        where: { articles: { some: { article_id: input.article_id } } },
      })

      return article_groups
    }),

  getAllRelations: adminProcedure.query(async ({ ctx }) => {
    const all_relations = await ctx.prisma.articleGroups.findMany()

    return all_relations
  }),

  getRelation: adminProcedure
    .input(
      z.object({
        article_id: z.string(),
        group_id: z.string(),
      })
    )
    .query(async ({ input, ctx }) => {
      const relation = await ctx.prisma.articleGroups.findUnique({
        where: {
          article_id_group_id: {
            article_id: input.article_id,
            group_id: input.group_id,
          },
        },
      })

      return relation
    }),
})
