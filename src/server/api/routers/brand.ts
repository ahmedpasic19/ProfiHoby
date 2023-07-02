import { z } from 'zod'

import { createTRPCRouter, publicProcedure, adminProcedure } from '../trpc'

export const brandRouter = createTRPCRouter({
  createBrand: adminProcedure
    .input(
      z.object({
        name: z.string(),
        article_ids: z.array(z.string()),
        group_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brand = await ctx.prisma.brand.create({
        data: {
          name: input.name,
          articles: {
            connect: input.article_ids.map((id) => ({ id })), // relate articles to brand
          },
          group_id: input.group_id,
        },
      })

      return brand
    }),

  updateBrand: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string(),
        article_ids: z.array(z.string()),
        group_id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const brand = await ctx.prisma.brand.update({
        where: { id: input.id },
        data: {
          name: input.name,
          articles: input.article_ids.length // update article relation
            ? { set: input.article_ids.map((id) => ({ id })) }
            : {},
          group_id: input.group_id,
        },
      })

      return brand
    }),

  deleteBrand: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const brand = await ctx.prisma.brand.delete({
        where: { id: input.id },
      })

      return brand
    }),

  getAllBrands: publicProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.brand.findMany({
      orderBy: { createdAt: 'asc' },
      include: { group: true },
    })
  }),

  getBrandsByGroupId: publicProcedure
    .input(z.object({ group_id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.brand.findMany({
        orderBy: { createdAt: 'asc' },
        where: { group_id: input.group_id },
      })
    }),

  getBrand: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.brand.findUnique({ where: { id: input.id } })
    }),
})
