import { z } from 'zod'

import { createTRPCRouter, adminProcedure, publicProcedure } from '../trpc'

export const groupRouter = createTRPCRouter({
  createGroup: adminProcedure
    .input(
      z.object({
        name: z.string(),
        category_id: z.string(),
        articles: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_group = await ctx.prisma.group.create({
        data: {
          name: input.name,
          category: { connect: { id: input.category_id } },
        },
      })

      return new_group
    }),

  updateGroup: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        category_id: z.string(),
        olx_category_id: z.string().nullish(),
        order_key: z.number().nullish(),
        articles: z.array(z.object({ id: z.string() })),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_group = await ctx.prisma.group.update({
        where: { id: input.id },
        data: {
          olx_category_id: input.olx_category_id,
          ...(input.order_key || input.order_key === 0
            ? { order_key: input.order_key }
            : {}),
          name: input.name,
          category: { connect: { id: input.category_id } },
        },
      })

      return updated_group
    }),

  deleteGroup: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      // Delete all relatons with articles
      await ctx.prisma.articleGroups.deleteMany({
        where: { group_id: input.id },
      })

      const deleted_group = await ctx.prisma.group.delete({
        where: { id: input.id },
      })

      return deleted_group
    }),

  getAllGroups: publicProcedure
    .input(z.string().nullish())
    .query(async ({ ctx, input }) => {
      const all_categories = await ctx.prisma.group.findMany({
        where: {
          ...(input ? { name: { contains: input, mode: 'insensitive' } } : {}),
        },
        include: { category: true },
        orderBy: { order_key: 'desc' },
      })

      return all_categories
    }),

  getGroup: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const group = await ctx.prisma.group.findUnique({
        where: { id: input.id },
      })

      return group
    }),
})
