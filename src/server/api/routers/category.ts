import { z } from 'zod'

import { createTRPCRouter, adminProcedure, publicProcedure } from '../trpc'

export const categoryRouter = createTRPCRouter({
  createCategory: adminProcedure
    .input(
      z.object({
        name: z.string(),
        groups: z.array(z.string()),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const new_category = await ctx.prisma.category.create({
        data: {
          name: input.name,
          groups: {
            connect: input.groups.map((id) => ({ id })),
          },
        },
      })

      return new_category
    }),

  updateCategory: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        groups: z.array(z.string()).nullish(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const updated_category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: {
          name: input.name,
          groups: input.groups
            ? { set: input.groups.map((id) => ({ id })) }
            : {},
        },
      })

      return updated_category
    }),

  deleteCategory: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deleted_category = await ctx.prisma.category.delete({
        where: { id: input.id },
      })

      return deleted_category
    }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const all_categories = await ctx.prisma.category.findMany({
      include: {
        groups: true,
      },
      orderBy: { createdAt: 'asc' },
    })

    return all_categories
  }),

  getCategory: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.id },
      })

      return category
    }),
})
