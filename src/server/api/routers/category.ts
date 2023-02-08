import { z } from 'zod'

import { createTRPCRouter, publicProcedure } from '../trpc'

export const categoryRouter = createTRPCRouter({
  createCategory: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      console.log(input)
      const new_category = await ctx.prisma.category.create({
        data: { name: input.name },
      })

      return new_category
    }),

  updateCategory: publicProcedure
    .input(z.object({ id: z.string(), name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const updated_category = await ctx.prisma.category.update({
        where: { id: input.id },
        data: { name: input.name },
      })

      return updated_category
    }),

  deleteCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const deleted_category = await ctx.prisma.category.delete({
        where: { id: input.id },
      })

      return deleted_category
    }),

  getAllCategories: publicProcedure.query(async ({ ctx }) => {
    const all_categories = await ctx.prisma.category.findMany()

    return all_categories
  }),

  getCategory: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ input, ctx }) => {
      const category = await ctx.prisma.category.findUnique({
        where: { id: input.id },
      })

      return category
    }),
})
